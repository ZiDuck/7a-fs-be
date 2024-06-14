import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MinioClientModule } from '../minio-client/minio-client.module';
import { RawFile } from './enitites/raw-file.entity';
import { RawFilesController } from './raw-files.controller';
import { RawFilesService } from './raw-files.service';

@Module({
    imports: [TypeOrmModule.forFeature([RawFile]), MinioClientModule],
    controllers: [RawFilesController],
    providers: [RawFilesService],
    exports: [RawFilesService],
})
export class RawFilesModule {}
