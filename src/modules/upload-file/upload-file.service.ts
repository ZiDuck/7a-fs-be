import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryResponse } from '../cloudinary/cloudinary-response';
import { CheckResourceExits } from '../cloudinary/dto/check-resource-exits.dto';
import { ResourceType } from '../../cores/enums/resource-type.enum';
import { ImagesService } from '../images/images.service';

@Injectable()
export class UploadFileService {
    constructor(private cloudinaryService: CloudinaryService) {}

    async uploadImage(file: Express.Multer.File, folder: string): Promise<CloudinaryResponse> {
        const cloudinaryResult = await this.cloudinaryService.uploadFile(file, folder);

        return cloudinaryResult;
    }

    async uploadImages(file: Express.Multer.File, folder: string): Promise<CloudinaryResponse> {
        return await this.cloudinaryService.uploadFile(file, folder);
    }

    async checkResourcesExists(params: CheckResourceExits): Promise<boolean> {
        return this.cloudinaryService.checkResourcesExists(params);
    }

    async deleteResources(publicIds: string[], resourceType: ResourceType): Promise<boolean> {
        return this.cloudinaryService.deleteResources(publicIds, resourceType);
    }
}
