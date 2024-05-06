import { ApiProperty } from '@nestjs/swagger';

export class GetRawFile {
    @ApiProperty()
    publicId: string;

    @ApiProperty()
    url: string;

    @ApiProperty()
    bytes: number;

    @ApiProperty()
    filename: string;

    @ApiProperty()
    secureUrl: string;

    @ApiProperty()
    resourceType: string;
}
