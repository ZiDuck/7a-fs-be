import { Module } from '@nestjs/common';

import { BackupModule } from '../backup/backup.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { FileHistoryModule } from '../file-history/file-history.module';
import { FormsModule } from '../forms/forms.module';
import { ImageHistoryModule } from '../image-history/image-history.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { RawFilesModule } from '../raw-files/raw-files.module';
import { UsersModule } from '../users/users.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
    imports: [CloudinaryModule, ImageHistoryModule, FileHistoryModule, RawFilesModule, BackupModule, NotificationsModule, UsersModule, FormsModule],
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule {}
