import { ApiProperty } from '@nestjs/swagger';

export class ImageOutput {
    @ApiProperty()
    id: string;

    @ApiProperty()
    url: string;

    @ApiProperty()
    publicId: string;
}
