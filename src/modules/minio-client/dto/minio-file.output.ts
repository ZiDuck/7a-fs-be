import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Expose()
export class MinioFileOutput {
    @ApiProperty()
    id: string;

    @ApiPropertyOptional()
    pathFile?: string;

    @ApiPropertyOptional()
    bytes?: number;

    @ApiPropertyOptional()
    mimetype?: string;

    @ApiPropertyOptional()
    lastMod?: string;

    @ApiPropertyOptional()
    secureUrl?: string;

    @Exclude()
    createdDate: Date;

    @Exclude()
    updatedDate: Date;
}
