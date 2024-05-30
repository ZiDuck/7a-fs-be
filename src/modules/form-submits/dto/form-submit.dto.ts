import { ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

import { IdExists } from '../../../common/validator/uuid.validator';
import { AttributeType, GROUP_QUESTION_TYPES, SINGLE_QUESTION_TYPES } from '../../form-questions/enums/attribute-type.enum';
import { Form } from '../../forms/entities/form.entity';
import { FormCategory } from '../../forms/enums/form-category.enum';
import { FormStatus } from '../../forms/enums/form-status.enum';
import { ImageOutput } from '../../images/dto/image.output';

function TransformSummaries() {
    return Transform(({ value }) => {
        return plainToInstance(GuestTextSummary, value);
    });
}

export class SingleQuestionFileConfigSubmit {
    @ApiProperty()
    id: string;

    @ApiProperty({ example: '1', description: 'Maximum number of files that can be uploaded' })
    maxNumOfFiles: number;

    @ApiProperty({ example: '10', description: 'Maximum file size in MB' })
    maxFileSize: number;
}

export class SingleQuestionValueSubmit {
    @ApiProperty()
    id: string;

    @ApiProperty({ example: 'Value of the question' })
    value: string;

    @ApiProperty({ type: ImageOutput, nullable: true })
    image: ImageOutput | null;

    @ApiProperty({ example: true })
    isCorrect: boolean;

    @ApiProperty({ example: true })
    isOther: boolean;

    @ApiProperty()
    order: number;
}

export class GuestAnswerId {
    @ApiProperty()
    id: string;

    @ApiProperty()
    value: string;
}

export class GuestFileValue {
    @ApiProperty()
    id: string;

    @ApiProperty()
    bytes: number;

    @ApiProperty()
    filename: string;

    @ApiProperty()
    publicId: string;

    @ApiProperty()
    secureUrl: string;

    @ApiProperty()
    resourceType: string;
}

export class GuestTextSummary {
    @ApiProperty()
    isCorrect: boolean;
}

export class GuestSelectSummary {
    @ApiProperty()
    id: string;

    @ApiProperty()
    isCorrect: boolean;
}

export class GuestGroupSummary {
    @ApiProperty()
    rowId: string;

    @ApiProperty()
    score: number;

    @ApiProperty()
    isCorrect: boolean;
}

export class GuestAnswerFormSingle {
    @ApiPropertyOptional()
    choiceIds?: GuestAnswerId[];

    @ApiPropertyOptional()
    textValue?: string;

    @ApiPropertyOptional()
    fileValues?: GuestFileValue[];

    @ApiPropertyOptional()
    @TransformSummaries()
    summaries?: GuestSelectSummary[] | GuestTextSummary;

    @ApiProperty()
    guestScore: number;
}

export class SingleQuestionSubmit {
    @ApiProperty()
    id: string;

    @ApiProperty({ example: 1 })
    score: number;

    @ApiProperty({ example: false })
    isOther: boolean;

    @ApiProperty()
    questionId: string;

    @ApiProperty({ type: [SingleQuestionValueSubmit] })
    @Type(() => SingleQuestionValueSubmit)
    singleQuestionValues: SingleQuestionValueSubmit[];

    @ApiProperty({ nullable: true, type: SingleQuestionFileConfigSubmit })
    @Type(() => SingleQuestionFileConfigSubmit)
    fileConfig: SingleQuestionFileConfigSubmit | null;

    @ApiProperty({
        description: 'Các câu trả lời có thể là một mảng các đối tượng GuestAnswerFormSingle hoặc một mảng các chuỗi ký tự',
        type: GuestAnswerFormSingle,
        isArray: true,
        example: [{ id: 'uuid' }],
    })
    @Type(() => GuestAnswerFormSingle)
    guestAnswer: GuestAnswerFormSingle;
}

export class GridId {
    gridIds: GuestAnswerFormGroup[];

    @ApiPropertyOptional()
    summaries?: GuestGroupSummary[];
}

export class GroupQuestionSubmit {
    @Type(() => GroupQuestionRowSubmit)
    rows: GroupQuestionRowSubmit[];

    @Type(() => GroupQuestionColumnSubmit)
    columns: GroupQuestionColumnSubmit[];

    @Type(() => GroupQuestionAnswerSubmit)
    answers: GroupQuestionAnswerSubmit[];

    guestAnswer: GridId;
}

export class GroupQuestionRowSubmit {
    @ApiProperty()
    id: string;

    @ApiProperty({ example: 1 })
    score: number;

    @ApiProperty()
    value: string;

    @ApiProperty()
    order: number;
}

export class GroupQuestionColumnSubmit {
    @ApiProperty()
    id: string;

    @ApiProperty()
    value: string;

    @ApiProperty()
    order: number;
}

export class GroupQuestionAnswerSubmit {
    @ApiProperty()
    id: string;

    @ApiPropertyOptional()
    rowOrder?: number;

    @ApiPropertyOptional()
    columnOrder?: number;

    @ApiProperty({ example: true })
    isCorrect: boolean;

    @ApiProperty()
    rowId: string;

    @ApiProperty()
    columnId: string;
}

export class GuestAnswerFormGroup {
    @ApiProperty()
    id: string;

    @ApiProperty()
    rowId: string;

    @ApiProperty()
    columnId: string;
}

export class FormQuestionSubmit {
    @ApiProperty()
    id: string;

    @ApiProperty({ example: 'Title of the question' })
    label: string;

    @ApiProperty({ nullable: true, example: 'Description of the question' })
    @ValidateIf((d) => d.description !== null)
    @IsString()
    @IsNotEmpty()
    description: string | null;

    @ApiPropertyOptional()
    @IsOptional()
    require: boolean;

    @ApiProperty({ type: Number })
    @IsNotEmpty()
    @IsInt()
    order: number;

    @ApiProperty({ type: ImageOutput, nullable: true })
    image: ImageOutput | null;

    @ApiProperty({ enum: AttributeType, enumName: 'AttributeType' })
    @IsEnum(AttributeType)
    attributeType: AttributeType;

    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    @IdExists(Form)
    formId: string;
}

export class SingleQuestionSubmitTemp extends FormQuestionSubmit {
    @ApiPropertyOptional({ type: SingleQuestionSubmit })
    @Type(() => SingleQuestionSubmit)
    singleQuestion?: SingleQuestionSubmit;
}

export class GroupQuestionSubmitTemp extends FormQuestionSubmit {
    @ApiPropertyOptional({ type: GroupQuestionSubmit })
    @Type(() => GroupQuestionSubmit)
    groupQuestion?: GroupQuestionSubmit;
}

export class FormSubmitDto {
    @ApiProperty({ example: 'uuid' })
    id: string;

    @ApiProperty({ example: 'Title of the form' })
    title: string;

    @ApiProperty({ nullable: true, example: 'Description of the form' })
    description: string | null;

    @ApiProperty()
    startSurvey: Date;

    @ApiProperty({ enum: FormStatus })
    status: FormStatus;

    @ApiProperty()
    version: number;

    @ApiProperty()
    hasAnswer: boolean;

    @ApiProperty()
    canSeeCorrectAnswer: boolean;

    @ApiProperty({ enum: FormCategory })
    category: FormCategory;

    @ApiProperty({ type: ImageOutput, nullable: true })
    image: ImageOutput | null;

    @ApiProperty({
        type: 'array',
        items: {
            oneOf: [
                {
                    $ref: getSchemaPath(SingleQuestionSubmitTemp),
                },
                {
                    $ref: getSchemaPath(GroupQuestionSubmitTemp),
                },
            ],
        },
    })
    @Type(() => FormQuestionSubmit, {
        keepDiscriminatorProperty: true,
        discriminator: {
            property: 'attributeType',
            subTypes: [
                ...SINGLE_QUESTION_TYPES.map((value) => ({ value: SingleQuestionSubmitTemp, name: value })),
                ...GROUP_QUESTION_TYPES.map((value) => ({ value: GroupQuestionSubmitTemp, name: value })),
            ],
        },
    })
    formQuestions: FormQuestionSubmit[];
}
