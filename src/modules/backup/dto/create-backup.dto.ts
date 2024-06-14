import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBackupDto {
    @ApiPropertyOptional()
    @IsOptional()
    filename?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    pathFile: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    mimetype?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    bytes?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    lastMod?: string;
}
