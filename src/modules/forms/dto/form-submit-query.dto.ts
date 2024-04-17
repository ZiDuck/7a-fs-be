import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FormSubmitQuery {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    version?: number;
}
