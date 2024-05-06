import { Module } from '@nestjs/common';
import { UploadFileService } from './upload-file.service';
import { UploadFileController } from './upload-file.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { RawFilesModule } from '../raw-files/raw-files.module';

@Module({
    imports: [CloudinaryModule, RolesModule, UsersModule, RawFilesModule],
    controllers: [UploadFileController],
    providers: [UploadFileService],
    exports: [UploadFileService],
})
export class UploadFileModule {}
