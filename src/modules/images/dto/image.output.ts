import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ImageOutput {
    @ApiProperty()
    id: string;

    // @Exclude()
    @ApiProperty()
    pathFile: string;

    // @Exclude()
    @ApiProperty()
    secureUrl: string;

    @ApiPropertyOptional()
    filename?: string;
}
