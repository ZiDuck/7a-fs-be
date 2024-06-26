import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { exec } from 'child_process';
import dayjs from 'dayjs';
import fs from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { Errors } from '../../common/errors';
import { InternalServerErrorBusinessException } from '../../common/exceptions/business.exception';
import { NotificationStatus, NotificationType } from '../../cores/constants';
import { env } from '../../cores/utils/env.util';
import { paginate } from '../../cores/utils/paginate.util';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateNotificationEvent } from '../notifications/events/create-notification.event';
import { UploadFileService } from '../upload-file/upload-file.service';
import { UsersService } from '../users/users.service';
import { CreateBackupDto } from './dto/create-backup.dto';
import { BackupHistory } from './entities/backup-history.entity';

@Injectable()
export class BackupService {
    constructor(
        @InjectRepository(BackupHistory) private backupHistoryRepository: Repository<BackupHistory>,
        private uploadFileService: UploadFileService,
        private cloudinaryService: CloudinaryService,
        private readonly userService: UsersService,
        private readonly eventEmitter: EventEmitter2,
    ) {}
    async create(data: CreateBackupDto) {
        const backupHistory = this.backupHistoryRepository.create(data);

        const result = await this.backupHistoryRepository.save(backupHistory);

        return result ? true : false;
    }

    async findAll(query: PageQueryDto) {
        const builder = this.backupHistoryRepository.createQueryBuilder();

        const result = await paginate(builder, query);

        return {
            ...result,
            items: result.items.map((item) => {
                return {
                    ...item,
                    secureUrl: `${env.String('MINIO_URL')}/${env.String('MINIO_BUCKET')}/${item.pathFile}`,
                };
            }),
        };
    }

    async findOne(id: string): Promise<BackupHistory> {
        const result = await this.backupHistoryRepository.findOne({ where: { id } });

        if (!result) throw Errors.FileNotFoundErrorBusiness(id);

        return result;
    }

    async remove(id: string) {
        const file = await this.backupHistoryRepository.findOneBy({
            id,
        });

        if (!file) {
            throw Errors.FileNotFoundErrorBusiness(id);
        }

        const removeLocal = await this.backupHistoryRepository.remove(file);

        // const removeRemote = await this.cloudinaryService.deleteResources([file.publicId], ResourceType.RAW);

        // return removeLocal && removeRemote ? true : false;
    }

    // async downloadFile(id: string) {
    //     const file = await this.findOne(id);

    //     const fileDownload = await this.cloudinaryService.downloadFile(file.publicId, {
    //         resource_type: ResourceType.RAW,
    //     });
    // }

    @Transactional()
    async dataBackupService() {
        const date = dayjs().subtract(1, 'M').toDate();
        const localDirectory = 'backup';
        const localFile = join(localDirectory, `${date.getMonth() + 1}-${date.getFullYear()}.tar`);

        if (!fs.existsSync(localDirectory)) {
            fs.mkdirSync(localDirectory);
        }

        try {
            const promise$ = new Promise((resolve, reject) => {
                exec(
                    `pg_dump --host=${env.String('POSTGRES_HOST')} --port=${env.Int(
                        'POSTGRES_PORT',
                        55431,
                    )} -U postgres --format=t -f ${localFile} -n ${env.String('POSTGRES_SCHEMA')} ${env.String('POSTGRES_DATABASE')}`,
                    {
                        env: {
                            PGPASSWORD: `${env.String('POSTGRES_PASSWORD')}`,
                        },
                    },
                    (err, stdout, stderr) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(stdout);
                    },
                );
            });

            await promise$;

            const backupDirectory = env.String('MINIO_PATH_BACKUP');

            const backupInput = await this.uploadFileService.uploadBackupPathFile(localFile, backupDirectory);

            // if (fileUpload) {
            // }

            const createBackupHistory: CreateBackupDto = {
                filename: backupInput.filename,
                pathFile: backupInput.pathFile,
                bytes: backupInput.bytes,
                mimetype: backupInput.mimetype,
            };

            await this.create(createBackupHistory);

            const users = await this.userService.findAllUser();

            const eventData: CreateNotificationEvent[] = [];

            users.forEach((user) => {
                eventData.push({
                    sentByUserId: null,
                    receivedByUserId: user.id,
                    status: NotificationStatus.SUCCESS,
                    type: NotificationType.BACKUP_DATA,
                    userId: user.id,
                    formId: null,
                });
            });

            this.eventEmitter.emit('system.backup', eventData);
        } catch (error) {
            console.log('Error: ' + error);
            throw new InternalServerErrorBusinessException(error.message);
        } finally {
            fs.unlinkSync(localFile);
        }
    }
}
