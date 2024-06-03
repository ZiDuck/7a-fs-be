import { ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNotEmptyObject,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    IsUrl,
    IsUUID,
    ValidateIf,
    ValidateNested,
} from 'class-validator';

import { IdExists } from '../../../common/validator/uuid.validator';
import { AttributeType, GROUP_QUESTION_TYPES, SINGLE_QUESTION_TYPES } from '../../form-questions/enums/attribute-type.enum';
import { Form } from '../../forms/entities/form.entity';
import { FormCategory } from '../../forms/enums/form-category.enum';
import { FormStatus } from '../../forms/enums/form-status.enum';
import { ImageOutput } from '../../images/dto/image.output';
import { FormSubmit } from '../entities/form-submit.entity';

export class UpdateSingleQuestionFileConfigSubmit {
    @ApiProperty()
    id: string;

    @ApiProperty({
        example: '1',
        description: 'Maximum number of files that can be uploaded',
    })
    maxNumOfFiles: number;

    @ApiProperty({
        example: '10',
        description: 'Maximum file size in MB',
    })
    maxFileSize: number;
}

export class UpdateSingleQuestionValueSubmit {
    @ApiProperty()
    @IsUUID()
    id: string;

    @ApiProperty({
        example: 'Value of the question',
    })
    @ValidateIf((o: UpdateSingleQuestionValueSubmit) => !o.isOther)
    @IsString()
    @IsNotEmpty()
    value: string;

    @ApiProperty({
        type: ImageOutput,
        nullable: true,
    })
    image: ImageOutput | null;

    @ApiProperty({
        example: true,
    })
    @IsNotEmpty()
    @IsBoolean()
    isOther: boolean;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    order: number;
}

export class UpdateGuestAnswerId {
    @ApiProperty()
    @IsNotEmpty()
    id: string;
}

export class UpdateGuestFileValue {
    @ApiProperty()
    @IsNotEmpty()
    id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    bytes: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    filename?: string;

    @ApiProperty()
    @IsUrl()
    secureUrl: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    mimetype?: string;
}

export class UpdateGuestTextSummary {
    @ApiProperty()
    isCorrect: boolean;
}

export class UpdateGuestSelectSummary {
    @ApiProperty()
    id: string;

    @ApiProperty()
    isCorrect: boolean;
}

export class UpdateGuestGroupSummary {
    @ApiProperty()
    rowId: string;

    @ApiProperty()
    score: number;

    @ApiProperty()
    isCorrect: boolean;
}

export class UpdateGuestAnswerFormSingle {
    @ApiPropertyOptional({
        type: [UpdateGuestAnswerId],
    })
    @ValidateIf((o) => o.choiceIds !== undefined)
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => UpdateGuestAnswerId)
    choiceIds?: UpdateGuestAnswerId[];

    @ApiPropertyOptional()
    @ValidateIf((o) => o.textValue !== undefined && o.textValue !== '')
    @IsString()
    textValue?: string;

    @ApiPropertyOptional({})
    @ValidateIf((o) => o.fileValues !== undefined)
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => UpdateGuestFileValue)
    fileValues?: UpdateGuestFileValue[];

    @ApiProperty({
        oneOf: [
            {
                type: 'array',
                items: {
                    $ref: getSchemaPath(UpdateGuestSelectSummary),
                },
            },
            {
                $ref: getSchemaPath(UpdateGuestTextSummary),
            },
        ],
    })
    summaries: UpdateGuestSelectSummary[] | UpdateGuestTextSummary;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    guestScore: number;
}

export class UpdateSingleQuestionSubmit {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    id: string;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsInt()
    score: number;

    @ApiPropertyOptional({ example: false })
    @ValidateIf((o) => o.isOther !== undefined)
    @IsBoolean()
    isOther?: boolean;

    @ApiPropertyOptional()
    questionId?: string;

    @ApiProperty({
        type: [UpdateSingleQuestionValueSubmit],
    })
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => UpdateSingleQuestionValueSubmit)
    singleQuestionValues: UpdateSingleQuestionValueSubmit[];

    @ApiProperty({
        nullable: true,
        type: UpdateSingleQuestionFileConfigSubmit,
    })
    @ValidateIf((o: UpdateSingleQuestionSubmit) => o.fileConfig !== null)
    @ValidateNested({ each: true })
    @Type(() => UpdateSingleQuestionFileConfigSubmit)
    fileConfig: UpdateSingleQuestionFileConfigSubmit | null;

    @ApiProperty({
        description: 'Các câu trả lời có thể là một mảng các đối tượng GuestAnswerFormSingle hoặc một mảng các chuỗi ký tự',
        type: UpdateGuestAnswerFormSingle,
        // example: [{ id: 'uuid' }],
    })
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => UpdateGuestAnswerFormSingle)
    guestAnswer: UpdateGuestAnswerFormSingle;
}

export class UpdateGuestAnswerFormGroup {
    @ApiProperty()
    @IsUUID()
    id: string;

    @ApiProperty({
        example: 1,
    })
    @IsUUID()
    rowId: string;

    @ApiProperty({
        example: 1,
    })
    @IsUUID()
    columnId: string;
}

export class UpdateGridId {
    @ApiProperty({
        type: [UpdateGuestAnswerFormGroup],
    })
    @ValidateNested({
        each: true,
    })
    @IsArray()
    gridIds: UpdateGuestAnswerFormGroup[];

    @ApiProperty({
        type: [UpdateGuestGroupSummary],
    })
    summaries: UpdateGuestGroupSummary[];
}

export class UpdateGroupQuestionAnswerSubmit {
    @ApiProperty()
    id: string;

    @ApiPropertyOptional()
    rowOrder?: number;

    @ApiPropertyOptional()
    columnOrder?: number;

    @ApiProperty({
        example: true,
    })
    isCorrect: boolean;

    // @Exclude()
    rowId: string;

    // @Exclude()
    columnId: string;
}

export class UpdateGroupQuestionRowSubmit {
    @ApiProperty()
    id: string;

    @ApiProperty({
        example: 1,
    })
    score: number;

    @ApiProperty()
    value: string;

    @ApiProperty()
    order: number;
}

export class UpdateGroupQuestionColumnSubmit {
    @ApiProperty()
    id: string;

    @ApiProperty()
    value: string;

    @ApiProperty()
    order: number;
}

export class UpdateGroupQuestionSubmit {
    @ApiProperty({
        type: [UpdateGroupQuestionRowSubmit],
    })
    @Type(() => UpdateGroupQuestionRowSubmit)
    rows: UpdateGroupQuestionRowSubmit[];

    @ApiProperty({
        type: [UpdateGroupQuestionColumnSubmit],
    })
    @Type(() => UpdateGroupQuestionColumnSubmit)
    columns: UpdateGroupQuestionColumnSubmit[];

    @ApiProperty({
        type: [UpdateGroupQuestionAnswerSubmit],
    })
    @Type(() => UpdateGroupQuestionAnswerSubmit)
    answers: UpdateGroupQuestionAnswerSubmit[];

    @ApiProperty({
        type: UpdateGridId,
    })
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => UpdateGridId)
    guestAnswer: UpdateGridId;
}

export class UpdateFormQuestionSubmit {
    @ApiProperty()
    @IsUUID()
    id: string;

    @ApiProperty({
        example: 'Title of the question',
    })
    @IsNotEmpty()
    @IsString()
    label: string;

    @ApiProperty({
        nullable: true,
        example: 'Description of the question',
    })
    @ValidateIf((d) => d.description !== null)
    @IsString()
    description: string | null;

    @ApiPropertyOptional()
    @IsOptional()
    require: boolean;

    @ApiProperty({
        type: Number,
    })
    @IsNotEmpty()
    @IsInt()
    order: number;

    @ApiProperty({
        type: ImageOutput,
        nullable: true,
    })
    image: ImageOutput | null;

    @ApiProperty({
        enum: AttributeType,
        enumName: 'AttributeType',
    })
    @IsEnum(AttributeType)
    attributeType: AttributeType;

    @ApiProperty({
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    @IdExists(Form)
    formId: string;
}

export class UpdateSingleQuestionSubmitTemp extends UpdateFormQuestionSubmit {
    @ApiProperty({
        type: UpdateSingleQuestionSubmit,
    })
    @Type(() => UpdateSingleQuestionSubmit)
    @ValidateNested({ each: true })
    singleQuestion: UpdateSingleQuestionSubmit;
}

export class UpdateGroupQuestionSubmitTemp extends UpdateFormQuestionSubmit {
    @ApiProperty({
        type: UpdateGroupQuestionSubmit,
    })
    @Type(() => UpdateGroupQuestionSubmit)
    @ValidateNested({ each: true })
    groupQuestion: UpdateGroupQuestionSubmit;
}

export class UpdateFormSubmitDto {
    @ApiProperty({
        example: 'uuid',
    })
    id: string;

    @ApiProperty({
        example: 'Title of the form',
    })
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: 'Description of the form',
    })
    @IsString()
    description: string;

    @ApiProperty({
        type: Date,
        nullable: true,
    })
    @ValidateIf((d) => d.startSurvey !== null)
    @Type(() => Date)
    @IsNotEmpty()
    @IsDate()
    startSurvey: Date | null;

    @ApiProperty({
        enum: FormStatus,
    })
    @IsEnum(FormStatus)
    @IsNotEmpty()
    status: FormStatus;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    version: number;

    @ApiProperty()
    @IsBoolean()
    hasAnswer: boolean;

    @ApiProperty()
    @IsBoolean()
    canSeeCorrectAnswer: boolean;

    @ApiProperty({
        enum: FormCategory,
    })
    @IsEnum(FormCategory)
    @IsNotEmpty()
    category: FormCategory;

    @ApiProperty({
        type: ImageOutput,
        nullable: true,
    })
    image: ImageOutput | null;

    @ApiProperty({
        example: 'uuid',
    })
    @IsUUID()
    @IdExists(FormSubmit)
    submitId: string;

    @ApiProperty({
        type: 'array',
        items: {
            oneOf: [
                {
                    $ref: getSchemaPath(UpdateSingleQuestionSubmitTemp),
                },
                {
                    $ref: getSchemaPath(UpdateGroupQuestionSubmitTemp),
                },
            ],
        },
    })
    @Type(() => UpdateFormQuestionSubmit, {
        keepDiscriminatorProperty: true,
        discriminator: {
            property: 'attributeType',
            subTypes: [
                ...SINGLE_QUESTION_TYPES.map((value) => ({ value: UpdateSingleQuestionSubmitTemp, name: value })),
                ...GROUP_QUESTION_TYPES.map((value) => ({ value: UpdateGroupQuestionSubmitTemp, name: value })),
            ],
        },
    })
    @IsNotEmpty()
    @ValidateNested({ each: true })
    formQuestions: UpdateFormQuestionSubmit[];
}
