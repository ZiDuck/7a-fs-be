import { Module, forwardRef } from '@nestjs/common';
import { UploadFileService } from './upload-file.service';
import { UploadFileController } from './upload-file.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ImagesModule } from '../images/images.module';

@Module({
    imports: [CloudinaryModule, forwardRef(() => ImagesModule)],
    controllers: [UploadFileController],
    providers: [UploadFileService],
    exports: [UploadFileService],
})
export class UploadFileModule {}
