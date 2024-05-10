import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';

import { FilePublicIdExists } from '../../../common/validator/file.validator';
import { ResourceType } from '../../../cores/enums/resource-type.enum';

export class CreateRawFileInput {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @FilePublicIdExists(ResourceType.RAW)
    publicId: string;

    @ApiProperty()
    @IsNotEmpty()
    url: string;

    @ApiPropertyOptional()
    filename?: string;

    @ApiPropertyOptional()
    @IsNotEmpty()
    @IsUrl({ protocols: ['https'] })
    secureUrl: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(ResourceType)
    resourceType: ResourceType;

    @ApiPropertyOptional()
    bytes?: number;
}
