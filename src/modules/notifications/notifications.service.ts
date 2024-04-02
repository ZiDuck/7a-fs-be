import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { Repository } from 'typeorm';
import { GetNotificationOutput } from './dto/get-notification.output';
import { CurrentUserContext } from '../../cores/providers/current-user-context.provider';
import { paginate } from '../../cores/utils/paginate.util';
import { PageQueryDto } from '../../common/dtos/page-query.dto';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
        private readonly currentUserContext: CurrentUserContext,
        private readonly cls: ClsService,
    ) {}

    async create(data: CreateNotificationDto[]) {
        const result = this.notificationRepository.create(data);
        await this.notificationRepository.save(result);
        return result;
    }

    async findAll(query: PageQueryDto) {
        const currentUserId = this.currentUserContext.getUserId();

        const builder = this.notificationRepository
            .createQueryBuilder('noti')
            .leftJoinAndSelect('noti.userReceived', 'receiver')
            .leftJoinAndSelect('noti.userSent', 'sent')
            .where('noti.receivedByUserId=:userId', { userId: currentUserId })
            .orderBy('noti.createdDate', 'DESC');
        const result = await paginate(builder, query);
        // const results = await this.usersRepository.find({ relations: { role: true } });

        // return result;

        // const notifications = await this.notificationRepository.find({
        //     relations: {
        //         userReceived: true,
        //         userSent: true,
        //     },
        //     where: {
        //         receivedByUserId: currentUserId,
        //     },
        //     take: 10,
        //     order: {
        //         createdDate: 'DESC',
        //     },
        // });

        const results = {
            ...result,
            items: result.items.map((notification) => {
                const data = new GetNotificationOutput();

                data.id = notification.id;
                data.sentBy = !notification.userSent
                    ? null
                    : {
                          id: notification.userSent.id,
                          fullName: notification.userSent.getName(),
                      };

                data.receivedBy = !notification.userReceived
                    ? null
                    : {
                          id: notification.userReceived.id,
                          fullName: notification.userReceived.getName(),
                      };
                data.status = notification.status;
                data.type = notification.type;
                data.createdDate = notification.createdDate;
                data.isRead = notification.isRead;

                const notificationInfo = notification.getNotificationInfo();

                data.title = notificationInfo.title;
                data.description = notificationInfo.description;

                return data;
            }),
        };

        return results;
    }

    async findOne(id: string) {
        const notification = await this.notificationRepository.findOne({
            where: {
                id,
            },
        });

        if (!notification) {
            throw new BadRequestException('Notification not found');
        }

        return notification;
    }

    async update(id: string) {
        const notification = await this.findOne(id);

        notification.isRead = true;

        await this.notificationRepository.save(notification);
    }

    remove(id: number) {
        return `This action removes a #${id} notification`;
    }
}
