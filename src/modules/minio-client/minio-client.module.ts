import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from 'nestjs-minio-client';

import { env } from '../../cores/utils/env.util';
import { MinioFile } from './entities/minio-file.entity';
import { MinioClientController } from './minio-client.controller';
import { MinioClientService } from './minio-client.service';

@Module({
    imports: [
        MinioModule.registerAsync({
            useFactory: () => {
                return {
                    endPoint: env.String('MINIO_ENDPOINT'),
                    port: parseInt(env.String('MINIO_PORT')),
                    useSSL: false,
                    accessKey: env.String('MINIO_ACCESSKEY'),
                    secretKey: env.String('MINIO_SECRETKEY'),
                };
            },
        }),
        TypeOrmModule.forFeature([MinioFile]),
    ],
    controllers: [MinioClientController],
    providers: [MinioClientService],
    exports: [MinioClientService],
})
export class MinioClientModule {}
