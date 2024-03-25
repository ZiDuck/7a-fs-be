import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadFileService } from './upload-file.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ArchiveFolder } from './enums/archive-folder.enum';
import { env } from '../../cores/utils/env.util';

@Controller('upload-file')
export class UploadFileController {
    constructor(private readonly uploadFileService: UploadFileService) {}

    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        return this.uploadFileService.uploadImage(file, ArchiveFolder.images);
    }

    @Post('images')
    @UseInterceptors(FilesInterceptor('file[]', 5))
    async uploadImages(@UploadedFile() file: Express.Multer.File) {
        return await this.uploadFileService.uploadImages(file, ArchiveFolder.images);
    }

    @Get('image')
    async checkResource() {
        return this.uploadFileService.checkResourcesExists({
            folder: '',
            publicId: 'public/feedback-system/images/brptjxsioywsffrcspov',
            resourceType: 'image',
        });
    }
}
