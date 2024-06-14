import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateSingleQuestionFileConfigInput {
    @ApiProperty({
        example: '1',
        description: 'Maximum number of files that can be uploaded',
    })
    @IsNumber()
    @IsOptional()
    maxNumOfFiles?: number;

    @ApiProperty({
        example: '10',
        description: 'Maximum file size in MB',
    })
    @IsNumber()
    @IsOptional()
    maxFileSize?: number;
}
