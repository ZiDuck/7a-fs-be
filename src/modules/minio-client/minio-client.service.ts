import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { MinioService } from 'nestjs-minio-client';
import { extname, parse } from 'path';
import { Repository } from 'typeorm';

import { env } from '../../cores/utils/env.util';
import { getFileSize } from '../../cores/utils/get-file-size.util';
import { MinioFileInput } from './dto/minio-file.input';
import { MinioFileOutput } from './dto/minio-file.output';
import { MinioFile } from './entities/minio-file.entity';

@Injectable()
export class MinioClientService {
    private readonly bucketName: string = env.String('MINIO_BUCKET');
    constructor(
        private readonly minioService: MinioService,
        @InjectRepository(MinioFile) private minioFileRepository: Repository<MinioFile>,
    ) {}

    public get client() {
        return this.minioService.client;
    }

    async uploadStreamFile(file: Express.Multer.File, directory: string) {
        // if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
        //     throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
        // }

        const id = randomUUID();

        const fileExtension = extname(file.originalname);

        const remoteFileName = [id, fileExtension].join('');

        const fullRemoteFileName = [directory, remoteFileName].join('');

        const metaData = {
            'Content-Type': file.mimetype,
            'X-Amz-Meta-Testing': 1234,
        };

        try {
            await this.client.putObject(this.bucketName, fullRemoteFileName, file.buffer, 10, metaData);

            const minioFile: MinioFileInput = {
                id: id,
                bytes: file.size,
                pathFile: fullRemoteFileName,
                mimetype: file.mimetype,
                filename: file.originalname,
            };

            const minFile = await this.createMinioFile(minioFile);

            const result: MinioFileOutput = {
                ...minFile,
                secureUrl: `${env.String('MINIO_URL')}/${this.bucketName}/${fullRemoteFileName}`,
            };

            return result;
        } catch (error) {
            console.error('Error uploading file to MinIO:', error);
            throw new HttpException('Error uploading file', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async uploadPathFile(file: string, remoteDirectory: string) {
        // if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
        //     throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
        // }

        const id = randomUUID();

        const fileExtension = extname(file);

        const remoteFileName = [id, fileExtension].join('');

        const fullRemoteFileName = [remoteDirectory, remoteFileName].join('');

        // const metaData = {
        //     'Content-Type': file.mimetype,
        //     'X-Amz-Meta-Testing': 1234,
        // };

        try {
            await this.client.fPutObject(this.bucketName, fullRemoteFileName, file);

            const minioFile: MinioFileInput = {
                id: id,
                pathFile: fullRemoteFileName,
            };

            const minFile = await this.createMinioFile(minioFile);

            const result: MinioFileOutput = {
                ...minFile,
                secureUrl: `${env.String('MINIO_URL')}/${this.bucketName}/${fullRemoteFileName}`,
            };

            return result;
        } catch (error) {
            console.error('Error uploading file to MinIO:', error);
            throw new HttpException('Error uploading file', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async uploadBackupPathFile(file: string, remoteDirectory: string) {
        // if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
        //     throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
        // }

        const id = randomUUID();

        const fileName = parse(file).name;

        const fileExtension = extname(file);

        const mimeType = 'application/x-tar';

        const fileSize = await getFileSize(file);

        const remoteFileName = [id, fileExtension].join('');

        const fullRemoteFileName = [remoteDirectory, remoteFileName].join('');

        // const metaData = {
        //     'Content-Type': file.mimetype,
        //     'X-Amz-Meta-Testing': 1234,
        // };

        try {
            await this.client.fPutObject(this.bucketName, fullRemoteFileName, file);

            const minioFile: MinioFileInput = {
                id: id,
                pathFile: fullRemoteFileName,
                filename: fileName,
                mimetype: mimeType,
                bytes: fileSize,
            };

            await this.createMinioFile(minioFile);

            return minioFile;
        } catch (error) {
            console.error('Error uploading file to MinIO:', error);
            throw new HttpException('Error uploading file', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    findById(id: string) {
        return this.minioFileRepository.findOne({
            where: { id },
        });
    }

    async delete(id: string) {
        const file = await this.findById(id);
        if (!file) {
            throw new HttpException('File không tồn tại', HttpStatus.BAD_REQUEST);
        }
        await this.client.removeObject(this.bucketName, file.pathFile);
        const result = await this.minioFileRepository.delete(file.id);
        return result.affected ? true : false;
    }

    async createMinioFile(data: MinioFileInput) {
        const minioFile = this.minioFileRepository.create(data);

        const result = await this.minioFileRepository.save(minioFile);

        return result;
    }
}
