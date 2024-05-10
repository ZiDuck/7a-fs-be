import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

import { CreateImageInput } from './create-image.input';

export class UpdateImageInput extends PartialType(CreateImageInput) {
    @ApiPropertyOptional()
    @IsInt()
    @IsOptional()
    id?: number;
}
