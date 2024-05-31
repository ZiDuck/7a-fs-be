import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { MinioService } from 'nestjs-minio-client';
import { extname } from 'path';
import { Repository } from 'typeorm';

import { env } from '../../cores/utils/env.util';
import { DeleteFileInput } from './dto/delete-file.input';
import { MinioFileInput } from './dto/minio-file.input';
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

    async upload(file: Express.Multer.File, bucketName: string = this.bucketName) {
        if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
            throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
        }

        const id = randomUUID();

        const fileExtension = extname(file.originalname);

        const remoteFileName = [id, fileExtension].join('');

        const fullRemoteFileName = [env.String('MINIO_PATH_IMAGE'), remoteFileName].join('');

        const metaData = {
            'Content-Type': file.mimetype,
            'X-Amz-Meta-Testing': 1234,
        };

        try {
            await this.client.putObject(bucketName, fullRemoteFileName, file.buffer, 10, metaData);

            const minioFile: MinioFileInput = {
                id: id,
                bytes: file.size,
                pathFile: fullRemoteFileName,
                mimetype: file.mimetype,
            };

            await this.createMinioFile(minioFile);

            return `${env.String('MINIO_ENDPOINT')}:${env.Int('MINIO_PORT', 9000)}/${bucketName}${fullRemoteFileName}`;
        } catch (error) {
            console.error('Error uploading file to MinIO:', error);
            throw new HttpException('Error uploading file', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    findOneByPathFile(file: string, bucketName: string = this.bucketName) {
        return this.minioFileRepository.findOne({
            where: {
                pathFile: file,
            },
        });
    }

    async delete(data: DeleteFileInput) {
        await this.client.removeObject(this.bucketName, data.objectName);
        const result = await this.minioFileRepository.delete(data.id);
        return result.affected ? true : false;
    }

    async listAllBuckets() {
        return this.client.listBuckets();
    }

    async createMinioFile(data: MinioFileInput) {
        const minioFile = await this.minioFileRepository.create(data);

        const result = await this.minioFileRepository.save(minioFile);

        return result ? true : false;
    }
}
