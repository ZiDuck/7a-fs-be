import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { FormQuestion } from '../../form-questions/entities/form-question.entity';
import { ImageOutput } from '../../images/dto/image.output';
import { Form } from '../entities/form.entity';
import { FormCategory } from '../enums/form-category.enum';
import { FormStatus } from '../enums/form-status.enum';

@Expose()
export class GetFormDto extends Form {
    @ApiProperty({
        example: 'uuid',
    })
    id: string;

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
    version: number;

    @ApiProperty()
    hasAnswer: boolean;

    @ApiProperty()
    canSeeCorrectAnswer: boolean;

    @ApiProperty({
        enum: FormCategory,
    })
    category: FormCategory;

    @ApiProperty({
        type: ImageOutput,
        nullable: true,
    })
    image: ImageOutput | null;

    @Exclude()
    imageId: string;

    @Exclude()
    formQuestions: FormQuestion[];

    @Exclude()
    createdDate: Date;

    @Exclude()
    updatedDate: Date;

    // @Exclude()
    deletedDate: Date;
}
