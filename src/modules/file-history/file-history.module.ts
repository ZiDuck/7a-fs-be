import { Module } from '@nestjs/common';
import { FileHistoryService } from './file-history.service';
import { FileHistoryController } from './file-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileHistory } from './entites/file-history.entity';
import { RawFilesModule } from '../raw-files/raw-files.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
    imports: [TypeOrmModule.forFeature([FileHistory]), RawFilesModule, CloudinaryModule],
    controllers: [FileHistoryController],
    providers: [FileHistoryService],
})
export class FileHistoryModule {}
