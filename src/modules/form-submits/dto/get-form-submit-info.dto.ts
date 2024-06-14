import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { FormQuestion } from '../../form-questions/entities/form-question.entity';
import { FormCategory } from '../../forms/enums/form-category.enum';
import { FormStatus } from '../../forms/enums/form-status.enum';
import { ImageOutput } from '../../images/dto/image.output';

export class GetFormSubmitInfo {
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

    @ApiProperty({
        example: 'uuid',
    })
    formSubmitId: string;

    @Exclude()
    formQuestions: FormQuestion[];
}
