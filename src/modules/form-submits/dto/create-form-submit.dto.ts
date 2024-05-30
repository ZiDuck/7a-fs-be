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

import { FilePublicIdExists } from '../../../common/validator/file.validator';
import { IdExists } from '../../../common/validator/uuid.validator';
import { ResourceType } from '../../../cores/enums/resource-type.enum';
import { AttributeType, GROUP_QUESTION_TYPES, SINGLE_QUESTION_TYPES } from '../../form-questions/enums/attribute-type.enum';
import { Form } from '../../forms/entities/form.entity';
import { FormCategory } from '../../forms/enums/form-category.enum';
import { FormStatus } from '../../forms/enums/form-status.enum';
import { ImageOutput } from '../../images/dto/image.output';

export class CreateSingleQuestionFileConfigSubmit {
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

export class CreateSingleQuestionValueSubmit {
    @ApiProperty()
    @IsUUID()
    id: string;

    @ApiProperty({
        example: 'Value of the question',
    })
    @ValidateIf((o: CreateSingleQuestionValueSubmit) => !o.isOther)
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

export class CreateGuestAnswerId {
    @ApiProperty()
    @IsNotEmpty()
    id: string;
}

export class CreateGuestFileValue {
    @ApiProperty()
    @IsNotEmpty()
    id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    bytes: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    filename: string;

    @ApiProperty()
    @FilePublicIdExists('resourceType')
    publicId: string;

    @ApiProperty()
    @IsUrl()
    secureUrl: string;

    @ApiProperty()
    @IsEnum(ResourceType)
    resourceType: ResourceType;
}

export class CreateGuestAnswerFormSingle {
    @ApiPropertyOptional()
    @ValidateIf((o) => o.choiceIds !== undefined)
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateGuestAnswerId)
    choiceIds?: CreateGuestAnswerId[];

    @ApiPropertyOptional()
    @ValidateIf((o) => o.textValue !== undefined && o.textValue !== '')
    @IsString()
    textValue?: string;

    @ApiPropertyOptional()
    @ValidateIf((o) => o.fileValues !== undefined)
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateGuestFileValue)
    fileValues?: CreateGuestFileValue[];
}

export class CreateSingleQuestionSubmit {
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
        type: [CreateSingleQuestionValueSubmit],
    })
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateSingleQuestionValueSubmit)
    singleQuestionValues: CreateSingleQuestionValueSubmit[];

    @ApiProperty({
        nullable: true,
        type: CreateSingleQuestionFileConfigSubmit,
    })
    @ValidateIf((o: CreateSingleQuestionSubmit) => o.fileConfig !== null)
    @ValidateNested({ each: true })
    @Type(() => CreateSingleQuestionFileConfigSubmit)
    fileConfig: CreateSingleQuestionFileConfigSubmit | null;

    @ApiProperty({
        description: 'Các câu trả lời có thể là một mảng các đối tượng GuestAnswerFormSingle hoặc một mảng các chuỗi ký tự',
        type: CreateGuestAnswerFormSingle,
        isArray: true,
        example: [{ id: 'uuid' }],
    })
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => CreateGuestAnswerFormSingle)
    guestAnswer: CreateGuestAnswerFormSingle;
}

export class CreateGridId {
    @ApiProperty()
    @ValidateNested({
        each: true,
    })
    @IsArray()
    gridIds: CreateGuestAnswerFormGroup[];
}

export class CreateGroupQuestionAnswerSubmit {
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

export class CreateGroupQuestionRowSubmit {
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

export class CreateGroupQuestionColumnSubmit {
    @ApiProperty()
    id: string;

    @ApiProperty()
    value: string;

    @ApiProperty()
    order: number;
}

export class CreateGuestAnswerFormGroup {
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

export class CreateGroupQuestionSubmit {
    @ApiProperty({
        type: [CreateGroupQuestionRowSubmit],
    })
    @Type(() => CreateGroupQuestionRowSubmit)
    rows: CreateGroupQuestionRowSubmit[];

    @ApiProperty({
        type: [CreateGroupQuestionColumnSubmit],
    })
    @Type(() => CreateGroupQuestionColumnSubmit)
    columns: CreateGroupQuestionColumnSubmit[];

    @ApiProperty({
        type: [CreateGroupQuestionAnswerSubmit],
    })
    @Type(() => CreateGroupQuestionAnswerSubmit)
    answers: CreateGroupQuestionAnswerSubmit[];

    @ApiProperty({
        type: CreateGuestAnswerFormGroup,
    })
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => CreateGridId)
    guestAnswer: CreateGridId;
}

export class CreateFormQuestionSubmit {
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

export class CreateSingleQuestionSubmitTemp extends CreateFormQuestionSubmit {
    @ApiProperty({
        type: CreateSingleQuestionSubmit,
    })
    @Type(() => CreateSingleQuestionSubmit)
    @ValidateNested({ each: true })
    singleQuestion: CreateSingleQuestionSubmit;
}

export class CreateGroupQuestionSubmitTemp extends CreateFormQuestionSubmit {
    @ApiProperty({
        type: CreateGroupQuestionSubmit,
    })
    @Type(() => CreateGroupQuestionSubmit)
    @ValidateNested({ each: true })
    groupQuestion: CreateGroupQuestionSubmit;
}

export class CreateFormSubmitDto {
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
        // type: [CreateFormQuestionSubmit],
        type: 'array',
        items: {
            oneOf: [
                {
                    $ref: getSchemaPath(CreateSingleQuestionSubmitTemp),
                },
                {
                    $ref: getSchemaPath(CreateGroupQuestionSubmitTemp),
                },
            ],
        },
    })
    @Type(() => CreateFormQuestionSubmit, {
        keepDiscriminatorProperty: true,
        discriminator: {
            property: 'attributeType',
            subTypes: [
                ...SINGLE_QUESTION_TYPES.map((value) => ({ value: CreateSingleQuestionSubmitTemp, name: value })),
                ...GROUP_QUESTION_TYPES.map((value) => ({ value: CreateGroupQuestionSubmitTemp, name: value })),
            ],
        },
    })
    @IsNotEmpty()
    @ValidateNested({ each: true })
    formQuestions: CreateFormQuestionSubmit[];
}
