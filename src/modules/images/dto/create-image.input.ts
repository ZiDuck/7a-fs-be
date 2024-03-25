import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { FilePublicIdExists } from '../../../common/validator/file.validator';
import { ResourceType } from '../../../cores/enums/resource-type.enum';

export class CreateImageInput {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @FilePublicIdExists(ResourceType.IMAGE)
    publicId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUrl({ protocols: ['https'] })
    url: string;
}
