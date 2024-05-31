import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class MinioFileInput {
    @ApiProperty()
    @IsUUID()
    @IsOptional()
    id: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    pathFile?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    bytes?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    mimetype?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    lastMod?: string;
}
