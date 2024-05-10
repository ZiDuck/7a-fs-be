import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UploadFileModule } from '../upload-file/upload-file.module';
import { UsersModule } from '../users/users.module';
import { BackupController } from './backup.controller';
import { BackupService } from './backup.service';
import { BackupHistory } from './entities/backup-history.entity';

@Module({
    controllers: [BackupController],
    providers: [BackupService],
    imports: [TypeOrmModule.forFeature([BackupHistory]), UploadFileModule, CloudinaryModule, UsersModule],
    exports: [BackupService],
})
export class BackupModule {}
