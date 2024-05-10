import { Module } from '@nestjs/common';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { RawFilesModule } from '../raw-files/raw-files.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { UploadFileController } from './upload-file.controller';
import { UploadFileService } from './upload-file.service';

@Module({
    imports: [CloudinaryModule, RolesModule, UsersModule, RawFilesModule],
    controllers: [UploadFileController],
    providers: [UploadFileService],
    exports: [UploadFileService],
})
export class UploadFileModule {}
