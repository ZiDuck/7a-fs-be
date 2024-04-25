import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ImageHistoryModule } from '../image-history/image-history.module';
import { FileHistoryModule } from '../file-history/file-history.module';
import { RawFilesModule } from '../raw-files/raw-files.module';

@Module({
    imports: [CloudinaryModule, ImageHistoryModule, FileHistoryModule, RawFilesModule],
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule {}
