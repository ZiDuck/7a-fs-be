import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Form } from '../entities/form.entity';
import { FormStatus } from '../enums/form-status.enum';
import { FormCategory } from '../enums/form-category.enum';

@Expose()
export class GetFormDto extends Form {
    @ApiProperty({
        example: 'Title of the form',
    })
    title: string;

    @ApiProperty({
        nullable: true,
        example: 'Description of the form',
    })
    description: string | null;

    @ApiProperty()
    startSurvey: Date;

    @ApiProperty({
        enum: FormStatus,
    })
    status: FormStatus;

    @ApiProperty()
    hasAnswer: boolean;

    @ApiProperty({
        enum: FormCategory,
    })
    category: FormCategory;

    @ApiProperty({
        nullable: true,
        example: 'uuid',
    })
    imageId: string | null;

    @ApiProperty()
    formQuestions: [];

    @Exclude()
    createdDate: Date;

    @Exclude()
    updatedDate: Date;
}
