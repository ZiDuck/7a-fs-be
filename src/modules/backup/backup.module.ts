import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';
import { UploadFileModule } from '../upload-file/upload-file.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackupHistory } from './entities/backup-history.entity';
import { UsersModule } from '../users/users.module';

@Module({
    controllers: [BackupController],
    providers: [BackupService],
    imports: [TypeOrmModule.forFeature([BackupHistory]), UploadFileModule, CloudinaryModule, UsersModule],
    exports: [BackupService],
})
export class BackupModule {}
