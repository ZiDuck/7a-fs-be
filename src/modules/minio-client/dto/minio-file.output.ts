import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { MinioFile } from '../entities/minio-file.entity';

@Expose()
export class MinioFileOutput extends MinioFile {
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

    @Exclude()
    createdDate: Date;

    @Exclude()
    updatedDate: Date;
}
