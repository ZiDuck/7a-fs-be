import { ApiProperty } from '@nestjs/swagger';

export class FileSubmitOutput {
    @ApiProperty()
    filename?: string;

    @ApiProperty()
    publicId: string;

    @ApiProperty()
    url: string;

    @ApiProperty()
    secureUrl?: string;

    @ApiProperty()
    resourceType: string;

    @ApiProperty()
    bytes?: number;
}
