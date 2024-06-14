// cloudinary.provider.ts

import { v2 as cloudinary } from 'cloudinary';

import { env } from '../../cores/utils/env.util';

export const CloudinaryProvider = {
    provide: 'CLOUDINARY',
    useFactory: () => {
        return cloudinary.config({
            cloud_name: env.String('CLOUDINARY_NAME') || 'dtxtzn5ii',
            api_key: env.String('CLOUDINARY_API_KEY') || '797967155671386',
            api_secret: env.String('CLOUDINARY_API_SECRET') || 'B7vCMeaP2OSRr6Q19jetHOYIQr8',
        });
    },
};
