import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class ImageOutput {
    @ApiProperty()
    id: string;

    // @Exclude()
    url: string;

    // @Exclude()
    secureUrl: string;

    // @Exclude()
    publicId: string;
}
