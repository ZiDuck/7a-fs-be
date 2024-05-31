import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class DeleteFileInput {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    objectName: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    bucketName?: string;
}
