import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ImagePublicIdExists } from '../../../cores/decorators/image-public-id-exists.decorator';

export class DeleteImageInput {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @ImagePublicIdExists()
    publicId: string;
}
