// cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryApiResponse, CloudinaryErrorResponse } from './dto/cloudinary-api-response.dto';
import { env } from '../../cores/utils/env.util';
import { CheckResourceExits } from './dto/check-resource-exits.dto';
import streamifier from 'streamifier';

export type ResourceType = 'image' | 'video' | 'raw';

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
}
