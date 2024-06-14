import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { FormCategory } from '../../forms/enums/form-category.enum';
import { FormTemplateDto } from './form-template.dto';

export class CreateFormTemplateInput {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        enum: FormCategory,
    })
    @IsEnum(FormCategory)
    @IsNotEmpty()
    category: FormCategory;

    @ApiProperty({
        type: FormTemplateDto,
    })
    metadata: FormTemplateDto;
}
