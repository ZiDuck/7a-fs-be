import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageQueryDto } from '../../../common/dtos/page-query.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderByDirection } from '../../../cores/constants';

export class FormFilterQuery extends PageQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ enum: OrderByDirection, default: OrderByDirection.ASC })
    @IsEnum(OrderByDirection)
    @IsOptional()
    readonly orderType?: OrderByDirection = OrderByDirection.ASC;

    @ApiPropertyOptional()
    @Type(() => String)
    @IsOptional()
    @IsString()
    readonly orderBy?: string;
}
