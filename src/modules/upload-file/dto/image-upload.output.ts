import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { CloudinaryApiResponse, CloudinaryErrorResponse } from '../../cloudinary/dto/cloudinary-api-response.dto';
import { ImageOutput } from '../../images/dto/image.output';

export class ImageUploadOutput {
    @ApiProperty({
        type: ImageOutput,
    })
    @Type(() => ImageOutput)
    image: ImageOutput | null;

    @ApiProperty({
        type: CloudinaryApiResponse,
    })
    @Type(() => CloudinaryApiResponse)
    imageCloudResponse: CloudinaryApiResponse | CloudinaryErrorResponse;
}
