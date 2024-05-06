import { ApiProperty } from '@nestjs/swagger';
import { FormCategory } from '../../forms/enums/form-category.enum';
import { FormTemplateDto } from './form-template.dto';
import { Exclude } from 'class-transformer';
import { FormTemplate } from '../entities/form-template.entity';
import { ImageOutput } from '../../images/dto/image.output';

export class GetFormTemplate extends FormTemplate {
    @ApiProperty()
    title: string;

    @ApiProperty({
        enum: FormCategory,
    })
    category: FormCategory;

    @ApiProperty({
        type: ImageOutput,
        nullable: true,
    })
    image: ImageOutput | null;

    @ApiProperty({
        type: FormTemplateDto,
    })
    @Exclude()
    metadata: FormTemplateDto;

    @Exclude()
    createdDate: Date;

    @Exclude()
    updatedDate: Date;
}

export class GetFormTemplateDetail extends FormTemplate {
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
