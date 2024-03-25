import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, ValidateNested } from 'class-validator';
import { CreateImageInput } from './create-image.input';

export class UpdateImageInput extends PartialType(CreateImageInput) {
    @ApiPropertyOptional()
    @IsInt()
    @IsOptional()
    id?: number;
}
