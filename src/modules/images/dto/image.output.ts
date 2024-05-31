import { ApiProperty } from '@nestjs/swagger';

export class ImageOutput {
    @ApiProperty()
    id: string;

    // @Exclude()
    pathFile: string;

    // @Exclude()
    secureUrl: string;
}
