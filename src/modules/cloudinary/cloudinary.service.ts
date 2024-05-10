// cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

import { env } from '../../cores/utils/env.util';
import { CheckResourceExits } from './dto/check-resource-exits.dto';
import { CloudinaryApiResponse, CloudinaryErrorResponse } from './dto/cloudinary-api-response.dto';

export type ResourceType = 'image' | 'video' | 'raw';

export interface FileOption {
    folder: string;

    format: string;
}

@Injectable()
export class CloudinaryService {
    uploadFile(file: Express.Multer.File, folder: string): Promise<CloudinaryApiResponse | CloudinaryErrorResponse> {
        return new Promise<CloudinaryApiResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: `${env.String('CLOUDINARY_CLOUD_PUBLICDIR')}/${folder}/${env.String('ENV')}` },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    uploadRawFile(file: string, folder?: string): Promise<CloudinaryApiResponse | CloudinaryErrorResponse> {
        return new Promise<CloudinaryApiResponse>((resolve, reject) => {
            cloudinary.uploader.upload(
                file,
                {
                    folder: `${env.String('CLOUDINARY_CLOUD_PUBLICDIR')}/${folder}/${env.String('ENV')}`,
                    resource_type: 'raw',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );
        });
    }

    uploadRawFileStream(file: Express.Multer.File, fileOption?: FileOption): Promise<CloudinaryApiResponse | CloudinaryErrorResponse> {
        return new Promise<CloudinaryApiResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: `${env.String('CLOUDINARY_CLOUD_PUBLICDIR')}/${fileOption.folder}/${env.String('ENV')}`,
                    resource_type: 'raw',
                    format: fileOption.format,
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async checkResourcesExists(params: CheckResourceExits): Promise<boolean> {
        try {
            if (!params.type) {
                await cloudinary.api.resource(params.publicId, {
                    resource_type: params.resourceType,
                });
            } else {
                await cloudinary.api.resource(params.publicId, {
                    resource_type: params.resourceType,
                    type: params.type,
                });
            }
        } catch (error) {
            return false;
        }
        return true;
    }

    async deleteResources(publicIds: string[], resourceType: ResourceType): Promise<boolean> {
        try {
            await cloudinary.api.delete_resources(publicIds, {
                resource_type: resourceType,
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async getFileDetails(publicId: string): Promise<any> {
        try {
            const result = await cloudinary.api.resource(publicId);
            return result;
        } catch (error) {
            throw new Error(`Error getting file details: ${error.message}`);
        }
    }

    async getAllFileRaw(): Promise<any> {
        try {
            // const result = await cloudinary.search.expression('public/feedback-system/backup/').max_results(12).execute();
            const result = await cloudinary.api.resources_by_asset_folder('public/feedback-system/backup/*');
            return result;
        } catch (error) {
            throw new Error(`Error getting file details: ${error.message}`);
        }
    }

    // async downloadFile(publicId: string, options: AdminAndResourceOptions): Promise<string> {
    //     try {
    //         const getFile = await this.getFileDetails(publicId);
    //         const response = await cloudinary.api.resource(publicId, options);
    //         return response;
    //     } catch (error) {
    //         throw new Error(`Error downloading file: ${error.message}`);
    //     }
    // }
}
