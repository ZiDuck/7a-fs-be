import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { RawFilesModule } from '../raw-files/raw-files.module';
import { FileHistory } from './entites/file-history.entity';
import { FileHistoryController } from './file-history.controller';
import { FileHistoryService } from './file-history.service';

@Module({
    imports: [TypeOrmModule.forFeature([FileHistory]), RawFilesModule, CloudinaryModule],
    controllers: [FileHistoryController],
    providers: [FileHistoryService],
    exports: [FileHistoryService],
})
export class FileHistoryModule {}
