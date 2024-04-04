import { ApiProperty } from '@nestjs/swagger';
import { FormCategory } from '../../forms/enums/form-category.enum';
import { FormTemplateDto } from './form-template.dto';
import { Exclude } from 'class-transformer';
import { FormTemplate } from '../entities/form-template.entity';

export class GetFormTemplate extends FormTemplate {
    @ApiProperty()
    title: string;

    @ApiProperty({
        enum: FormCategory,
    })
    category: FormCategory;

    @ApiProperty({
        type: FormTemplateDto,
    })
    metadata: FormTemplateDto;

    @Exclude()
    createdDate: Date;

    @Exclude()
    updatedDate: Date;
}
