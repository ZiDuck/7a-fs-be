import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

import { PageQueryDto } from '../../../common/dtos/page-query.dto';

export class FormSubmitQuery extends PageQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    version?: number;
}
