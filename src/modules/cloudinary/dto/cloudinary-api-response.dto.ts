// cloudinary-response.ts
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

// export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;
/**
 * CloudinaryResponseDto model documentation.
 * This model supports dynamic additional properties not explicitly defined.
 */
export class CloudinaryApiResponse implements UploadApiResponse {
    @ApiProperty({ example: 'sample_public_id', description: 'The unique identifier for the uploaded resource' })
    public_id: string;

    // @ApiProperty({ example: 1, description: 'Version of the uploaded resource' })
    @Exclude()
    version: number;

    @ApiProperty({ example: 'abcdef12345', description: 'A signature for validating the integrity of the resource' })
    signature: string;

    // @ApiProperty({ example: 800, description: 'Width of the resource in pixels' })
    @Exclude()
    width: number;

    // @ApiProperty({ example: 600, description: 'Height of the resource in pixels' })
    @Exclude()
    height: number;

    @ApiProperty({ example: 'jpg', description: 'Format of the resource' })
    format: string;

    @ApiProperty({ example: 'image', enum: ['image', 'video', 'raw', 'auto'], description: 'Type of the resource' })
    resource_type: 'image' | 'video' | 'raw' | 'auto';

    @ApiProperty({ example: '2023-04-01T12:34:56Z', description: 'The ISO date string of when the resource was created' })
    created_at: string;

    // @ApiProperty({ example: ['tag1', 'tag2'], description: 'Tags associated with the resource', type: [String] })
    @Exclude()
    tags: string[];

    // @ApiProperty({ example: 1, description: 'Number of pages in the resource, applicable to documents' })
    @Exclude()
    pages: number;

    // @ApiProperty({ example: 50000, description: 'Size of the resource in bytes' })
    @Exclude()
    bytes: number;

    @ApiProperty({ example: 'upload', description: 'The type of storage Cloudinary uses for the resource' })
    type: string;

    // @ApiProperty({ example: 'abcd1234', description: 'An ETag value for the resource' })
    @Exclude()
    etag: string;

    // @ApiProperty({ example: false, description: 'Indicates if the resource is a placeholder' })
    @Exclude()
    placeholder: boolean;

    @ApiProperty({ example: 'http://res.cloudinary.com/...', description: 'The URL of the resource' })
    url: string;

    @ApiProperty({ example: 'https://res.cloudinary.com/...', description: 'The secure URL of the resource' })
    secure_url: string;

    @ApiProperty({ example: 'public', description: 'Access mode of the resource' })
    access_mode: string;

    @ApiProperty({ example: 'original_filename.jpg', description: 'The original filename of the uploaded resource' })
    original_filename: string;

    // @ApiProperty({ example: ['moderation1', 'moderation2'], description: 'Moderation status of the resource', type: [String] })
    @Exclude()
    moderation: string[];

    // @ApiProperty({ example: ['access_control1', 'access_control2'], description: 'Access control settings for the resource', type: [String] })
    @Exclude()
    access_control: string[];

    // @ApiProperty({ example: {}, description: 'Context metadata associated with the resource' })
    @Exclude()
    context: object;

    // @ApiProperty({ example: {}, description: 'Custom metadata fields associated with the resource' })
    @Exclude()
    metadata: object;

    // @ApiProperty({ example: [['blue', 0.5]], description: 'Dominant colors of the image, if available', type: 'array', isArray: true })
    @Exclude()
    colors?: [string, number][];

    // @ApiProperty({ example: 'dynamic value', description: 'Any additional properties not explicitly defined' })
    [futureKey: string]: any;
}

export class CloudinaryErrorResponse implements UploadApiErrorResponse {
    [futureKey: string]: any;
    message: string;
    name: string;
    http_code: number;
}
