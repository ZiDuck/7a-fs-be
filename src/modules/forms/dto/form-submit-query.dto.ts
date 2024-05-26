import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PageQueryDto } from '../../../common/dtos/page-query.dto';

export class FormSubmitQuery extends PageQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    version?: number;
}
