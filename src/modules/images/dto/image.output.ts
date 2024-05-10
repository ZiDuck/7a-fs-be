import { ApiProperty } from '@nestjs/swagger';

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
