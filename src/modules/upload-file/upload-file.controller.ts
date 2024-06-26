import { Controller, Get, InternalServerErrorException, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Transactional } from 'typeorm-transactional';

import { ApiException } from '../../cores/decorators/api-exception.decorator';
import { UseRoleGuard } from '../../cores/decorators/use-role.decorator';
import { MinioFileOutput } from '../minio-client/dto/minio-file.output';
import { MinioClientService } from '../minio-client/minio-client.service';
import { FileUploadDto } from './enums/file-upload.dto';
import { UploadFileService } from './upload-file.service';

@ApiTags('upload-file')
@Controller('upload-file')
export class UploadFileController {
    constructor(
        private readonly uploadFileService: UploadFileService,
        private readonly minioClientService: MinioClientService,
    ) {}

    @UseRoleGuard()
    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Image file to upload to cloudinary',
        type: FileUploadDto,
    })
    @ApiOkResponse({
        description: 'The image has been uploaded to cloudinary',
        type: MinioFileOutput,
    })
    @ApiException(() => InternalServerErrorException, {
        description: 'Error when uploading image to cloudinary',
    })
    @Transactional()
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        try {
            // return plainToClass(GetRawFile, await this.minioClientService.upload(file));
            return await this.uploadFileService.uploadStreamFile(file);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    // @Post('images')
    // @UseInterceptors(FilesInterceptor('file[]', 5))
    // async uploadImages(@UploadedFile() file: Express.Multer.File) {
    //     return await this.uploadFileService.uploadImages(file, ArchiveFolder.images);
    // }

    @Transactional()
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Image file to upload to cloudinary',
        type: FileUploadDto,
    })
    @ApiOkResponse({
        description: 'The image has been uploaded to cloudinary',
        type: MinioFileOutput,
    })
    @ApiException(() => InternalServerErrorException, {
        description: 'Error when uploading image to cloudinary',
    })
    @Post('raw')
    async uploadFiles(@UploadedFile() file: Express.Multer.File) {
        return await this.uploadFileService.uploadFileSubmit(file);
    }

    @UseRoleGuard()
    @Get('image')
    async checkResource() {
        return this.uploadFileService.checkResourcesExists({
            folder: '',
            publicId: 'public/feedback-system/images/brptjxsioywsffrcspov',
            resourceType: 'image',
        });
    }

    // @UseRoleGuard()
    // @Delete('image')
    // @ApiNoContentResponse({ description: 'Delete image successfully' })
    // @Transactional()
    // async deleteImage(@Body() data: DeleteImageInput): Promise<void> {
    //     try {
    //         await this.uploadFileService.deleteOneImage(data);
    //     } catch (error) {
    //         if (error instanceof HttpException) throw error;

    //         throw new InternalServerErrorException(error.message);
    //     }
    // }

    // @Get('download')
    // async download(@Param('publicId') publicId: string) {
    //     const test = 'public/feedback-system/images/ojjsfjmt2saxtkrh245k';
    //     return await this.uploadFileService.downloadFile(test);
    // }

    // @Get(':publicId')
    // async getDetailFile(@Param('publicId') publicId: string) {
    //     const test = 'public/feedback-system/images/ojjsfjmt2saxtkrh245k';
    //     return await this.uploadFileService.getDetailFile(test);
    // }
}
