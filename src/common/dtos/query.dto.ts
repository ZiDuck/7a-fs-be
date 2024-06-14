import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { PageQueryDto } from './page-query.dto';

export class QueryDto extends PageQueryDto {
    // @ApiPropertyOptional({ enum: OrderByDirection, default: OrderByDirection.ASC })
    // @AppIsEnum(OrderByDirection)
    // @IsOptional()
    // readonly order?: OrderByDirection = OrderByDirection.ASC;

    @ApiPropertyOptional()
    @Type(() => String)
    @IsString()
    @IsOptional()
    readonly q?: string;

    @ApiPropertyOptional({ default: false })
    @Type(() => Boolean)
    @IsBoolean()
    @IsOptional()
    readonly isDeleted?: boolean = false;
}
