import { BadRequestException, Injectable } from '@nestjs/common';

import { env } from '../../cores/utils/env.util';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CheckResourceExits } from '../cloudinary/dto/check-resource-exits.dto';
import { CloudinaryApiResponse, CloudinaryErrorResponse } from '../cloudinary/dto/cloudinary-api-response.dto';
import { DeleteImageInput } from '../images/dto/delete-image.input';
import { MinioClientService } from '../minio-client/minio-client.service';
import { RawFilesService } from '../raw-files/raw-files.service';

@Injectable()
export class UploadFileService {
    constructor(
        private cloudinaryService: CloudinaryService,
        private rawService: RawFilesService,
        private minioClientService: MinioClientService,
    ) {}

    async uploadStreamFile(file: Express.Multer.File, directory: string = env.String('MINIO_PATH_IMAGE')) {
        const result = await this.minioClientService.uploadStreamFile(file, directory);

        return result;
    }

    async uploadImages(file: Express.Multer.File, folder: string): Promise<CloudinaryApiResponse | CloudinaryErrorResponse> {
        return await this.cloudinaryService.uploadFile(file, folder);
    }

    async uploadFileSubmit(file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File không tồn tại. Vui lòng kiểm tra lại!');
        }

        const mimeType = file.mimetype;

        const documentDirectory = env.String('MINIO_PATH_DOCUMENT');
        const videoDirectory = env.String('MINIO_PATH_VIDEO');

        if (mimeType.startsWith('image/')) {
            return await this.uploadStreamFile(file);
        } else if (mimeType.startsWith('video/')) {
            return await this.uploadStreamFile(file, videoDirectory);
        } else {
            return await this.uploadStreamFile(file, documentDirectory);
        }

        // return await this.cloudinaryService.uploadFile(file, folder);
    }

    async checkResourcesExists(params: CheckResourceExits): Promise<boolean> {
        return this.cloudinaryService.checkResourcesExists(params);
    }

    async deleteOneImage(data: DeleteImageInput) {
        await this.rawService.remove(data.publicId);
    }

    async getDetailFile(publicId: string) {
        return await this.cloudinaryService.getFileDetails(publicId);
    }

    // async downloadFile(publicId: string) {
    //     return await this.cloudinaryService.downloadFile(publicId);
    // }

    async uploadPathFile(file: string, folder?: string) {
        return await this.minioClientService.uploadPathFile(file, folder);
    }
}
