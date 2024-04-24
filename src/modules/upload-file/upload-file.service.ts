import { Injectable } from '@nestjs/common';
import { fromBuffer } from 'file-type';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryApiResponse, CloudinaryErrorResponse } from '../cloudinary/dto/cloudinary-api-response.dto';
import { CheckResourceExits } from '../cloudinary/dto/check-resource-exits.dto';
import { ImagesService } from '../images/images.service';
import { DeleteImageInput } from '../images/dto/delete-image.input';
import { ImageUploadOutput } from './dto/image-upload.output';
import { ArchiveFolder } from './enums/archive-folder.enum';
import path from 'path';
import { RawFilesService } from '../raw-files/raw-files.service';
import { ResourceType } from '../../cores/enums/resource-type.enum';

@Injectable()
export class UploadFileService {
    constructor(
        private cloudinaryService: CloudinaryService,
        private imageService: ImagesService,
        private rawService: RawFilesService,
    ) {}

    async uploadImage(file: Express.Multer.File, folder: string): Promise<ImageUploadOutput> {
        const cloudinaryResult = await this.cloudinaryService.uploadFile(file, folder);

        if (!cloudinaryResult?.public_id) {
            return {
                imageCloudResponse: cloudinaryResult,
                image: null,
            };
        }

        const imageResult = await this.rawService.create({
            publicId: cloudinaryResult.public_id,
            url: cloudinaryResult.url,
            bytes: cloudinaryResult.bytes,
            filename: file.originalname,
            secureUrl: cloudinaryResult.secure_url,
            resourceType: cloudinaryResult.resource_type as ResourceType,
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

    async uploadImageSubmit(file: Express.Multer.File, folder: string) {
        const cloudinaryResult = await this.cloudinaryService.uploadFile(file, folder);

        if (!cloudinaryResult?.public_id) {
            return cloudinaryResult as CloudinaryErrorResponse;
        }

        const imageResult = await this.imageService.create({
            publicId: cloudinaryResult.public_id,
            url: cloudinaryResult.url,
            bytes: cloudinaryResult.bytes,
            filename: file.originalname,
            secureUrl: cloudinaryResult.secure_url,
        });

        return {
            ...imageResult,
            resourceType: cloudinaryResult.resource_type,
        };
    }

    async uploadDocumentFileSubmit(file: Express.Multer.File, folder: string, format: string) {
        const cloudinaryResult = await this.cloudinaryService.uploadRawFileStream(file, {
            folder,
            format,
        });

        if (!cloudinaryResult?.public_id) {
            return cloudinaryResult as CloudinaryErrorResponse;
        }

        const rawFileResult = await this.rawService.create({
            publicId: cloudinaryResult.public_id,
            url: cloudinaryResult.url,
            resourceType: cloudinaryResult.resource_type as ResourceType,
            secureUrl: cloudinaryResult.secure_url,
            bytes: cloudinaryResult.bytes,
            filename: file.originalname,
        });

        return rawFileResult;
    }

    async uploadImages(file: Express.Multer.File, folder: string): Promise<CloudinaryApiResponse | CloudinaryErrorResponse> {
        return await this.cloudinaryService.uploadFile(file, folder);
    }

    async uploadFileSubmit(file: Express.Multer.File) {
        const fileTypeResult = await fromBuffer(file.buffer);

        if (!fileTypeResult) {
            throw new Error('Cannot determine file type');
        }

        const mimeType = fileTypeResult.mime;
        const extension = path.extname(file.originalname).toLowerCase().slice(1); // Lấy đuôi file

        if (mimeType.startsWith('image/')) {
            return await this.uploadImageSubmit(file, ArchiveFolder.images);
        } else if (mimeType.startsWith('video/')) {
        } else {
            return await this.uploadDocumentFileSubmit(file, ArchiveFolder.documents, extension);
        }

        // return await this.cloudinaryService.uploadFile(file, folder);
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

    // async downloadFile(publicId: string) {
    //     return await this.cloudinaryService.downloadFile(publicId);
    // }

    async uploadRawFile(file: string, folder?: string) {
        return await this.cloudinaryService.uploadRawFile(file, folder);
    }
}
