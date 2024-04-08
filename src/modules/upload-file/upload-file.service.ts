import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryApiResponse, CloudinaryErrorResponse } from '../cloudinary/dto/cloudinary-api-response.dto';
import { CheckResourceExits } from '../cloudinary/dto/check-resource-exits.dto';
import { ImagesService } from '../images/images.service';
import { DeleteImageInput } from '../images/dto/delete-image.input';
import { ImageUploadOutput } from './dto/image-upload.output';

@Injectable()
export class UploadFileService {
    constructor(
        private cloudinaryService: CloudinaryService,
        private imageService: ImagesService,
    ) {}

    async uploadImage(file: Express.Multer.File, folder: string): Promise<ImageUploadOutput> {
        const cloudinaryResult = await this.cloudinaryService.uploadFile(file, folder);

        if (!cloudinaryResult?.public_id) {
            return {
                imageCloudResponse: cloudinaryResult,
                image: null,
            };
        }

        const imageResult = await this.imageService.create({
            publicId: cloudinaryResult.public_id,
            url: cloudinaryResult.secure_url,
        });

        return {
            image: {
                id: imageResult.id,
                publicId: cloudinaryResult.public_id,
                url: cloudinaryResult.secure_url,
            },
            imageCloudResponse: cloudinaryResult,
        };
    }

    async uploadImages(file: Express.Multer.File, folder: string): Promise<CloudinaryApiResponse | CloudinaryErrorResponse> {
        return await this.cloudinaryService.uploadFile(file, folder);
    }

    async checkResourcesExists(params: CheckResourceExits): Promise<boolean> {
        return this.cloudinaryService.checkResourcesExists(params);
    }

    async deleteOneImage(data: DeleteImageInput) {
        await this.imageService.deleteOne(data);
    }

    async getDetailFile(publicId: string) {
        return await this.cloudinaryService.getFileDetails(publicId);
    }

    async downloadFile(publicId: string) {
        return await this.cloudinaryService.downloadFile(publicId);
    }

    async uploadRawFile(file: string) {
        return await this.cloudinaryService.uploadRawFile(file);
    }
}
