import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FormSummaryQuery {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    version?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    questionId?: string;
}
