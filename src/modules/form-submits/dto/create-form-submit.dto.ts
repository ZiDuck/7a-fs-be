import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
    filename: string;

    @ApiProperty()
    publicId: string;

    @ApiProperty()
    secureUrl: string;

    @ApiProperty()
    resourceType: string;
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
        type: [CreateFormQuestionSubmit],
        // type: 'array',
        // items: {
        //     oneOf: [
        //         {
        //             $ref: getSchemaPath(CreateFormQuestionSubmit),
        //         },
        //         {
        //             $ref: getSchemaPath(CreateFormQuestionSubmit),
        //         },
        //     ],
        // },
        // discriminator: {
        // propertyName: 'attributeType',
        // mapping: {
        //     ...SINGLE_QUESTION_TYPES.reduce((acc, value) => ({ ...acc, [value]: getSchemaPath(CreateSingleQuestionSubmitTemp) }), {}),
        //     ...GROUP_QUESTION_TYPES.reduce((acc, value) => ({ ...acc, [value]: getSchemaPath(CreateGroupQuestionSubmitTemp) }), {}),
        // },
        // },
        example: {
            id: '6894b510-46a1-4cb0-82cf-a6b917c97ba0',
            title: 'Standard Form 2',
            description: null,
            startSurvey: '2024-04-03T17:00:00.000Z',
            status: 'ACCEPTED',
            hasAnswer: true,
            canSeeCorrectAnswer: true,
            category: 'PATIENT_CATEGORY',
            version: 1,
            formQuestions: [
                {
                    id: 'c4d3b9ad-c49f-4368-a823-bad1b9fe5905',
                    label: 'Title of the CHECKBOX BUTTON',
                    description: 'Description of the CHECKBOX BUTTON',
                    require: true,
                    order: 0,
                    image: null,
                    attributeType: 'CHECKBOX_BUTTON',
                    formId: '6894b510-46a1-4cb0-82cf-a6b917c97ba0',
                    singleQuestion: {
                        id: '00984a99-dfd1-4e4f-a33d-d1b0831e363c',
                        score: 1,
                        singleQuestionValues: [
                            {
                                id: '26bec405-1c3f-413f-b9be-ac276f17c23f',
                                value: 'checkbox value 2',
                                image: null,
                                isOther: false,
                            },
                            {
                                id: '90002f57-ee51-4cee-a925-8360d0271533',
                                value: 'checkbox value 1',
                                image: null,
                                isOther: false,
                            },
                            {
                                id: 'fff60777-97a3-4b7d-9beb-c771b261f7de',
                                value: 'checkbox value 3',
                                image: null,
                                isOther: false,
                            },
                            {
                                id: '48fadfa0-8ea9-4c4e-9f70-a57ef3673f4f',
                                value: '',
                                image: null,
                                isOther: true,
                            },
                        ],
                        fileConfig: null,
                        guestAnswer: {
                            choiceIds: [
                                {
                                    id: '90002f57-ee51-4cee-a925-8360d0271533',
                                },
                                {
                                    id: '48fadfa0-8ea9-4c4e-9f70-a57ef3673f4f',
                                },
                            ],
                        },
                    },
                },
                {
                    id: '5455cb8e-f3d2-4e0b-9670-259d3a34857b',
                    label: 'Title of the text box',
                    description: 'Description of the text box',
                    require: true,
                    order: 1,
                    image: null,
                    attributeType: 'TEXT_BOX',
                    formId: '6894b510-46a1-4cb0-82cf-a6b917c97ba0',
                    singleQuestion: {
                        id: '8eb1ed4d-0745-4296-91d4-bf2bb035909a',
                        score: 5,
                        singleQuestionValues: [
                            {
                                id: '7174f81f-38fe-4291-871d-b7be191a945b',
                                value: 'true value',
                                image: null,
                                isOther: false,
                            },
                        ],
                        fileConfig: null,
                        guestAnswer: {
                            textValue: 'true value',
                        },
                    },
                },
                {
                    id: 'fbc9eb62-84f4-4957-a8c5-42e095bf87d2',
                    label: 'Title of the paragraph',
                    description: 'Description of the paragraph',
                    require: true,
                    order: 2,
                    image: null,
                    attributeType: 'PARAGRAPH',
                    formId: '6894b510-46a1-4cb0-82cf-a6b917c97ba0',
                    singleQuestion: {
                        id: '5f5de2c7-42d1-425b-b232-a3084eea828f',
                        score: 5,
                        singleQuestionValues: [
                            {
                                id: '3ab2d69f-d86d-4f22-bdd8-586f864ccf98',
                                value: 'Cau tra loi dung 1',
                                image: null,
                                isOther: false,
                            },
                            {
                                id: 'a798924b-d8cd-49ec-af47-231239c42479',
                                value: 'Cau tra loi dung 2',
                                image: null,
                                isOther: false,
                            },
                        ],
                        fileConfig: null,
                        guestAnswer: {
                            textValue: 'Cau tra loi dung 1',
                        },
                    },
                },
                {
                    id: 'd3f400b0-67a3-45c1-9a5c-64aea4a52d32',
                    label: 'Title of the multi choice',
                    description: 'Description of multi choice',
                    require: true,
                    order: 3,
                    image: null,
                    attributeType: 'RADIO_GRID',
                    formId: '6894b510-46a1-4cb0-82cf-a6b917c97ba0',
                    groupQuestion: {
                        rows: [
                            {
                                id: '26d4312a-c894-48b5-a00f-fd746a61dbaa',
                                score: 5,
                                value: 'Row 1',
                                order: 0,
                            },
                            {
                                id: 'da2025d6-c931-4084-9ce1-89e183b54ee4',
                                score: 5,
                                value: 'Row 2',
                                order: 1,
                            },
                        ],
                        totalScore: 10,
                        columns: [
                            {
                                id: '76933dd6-385f-441d-91af-97e79faaf1a9',
                                value: 'Column 1',
                                order: 0,
                            },
                            {
                                id: '9dc75a3a-e1d9-4a87-98fb-e6ccb33e7935',
                                value: 'Column 2',
                                order: 1,
                            },
                            {
                                id: '63a854f3-2687-40f3-8c5e-beefa0324fc6',
                                value: 'Column 3',
                                order: 2,
                            },
                        ],
                        answers: [
                            {
                                id: '5d03a715-2e3a-4896-b30b-6ad1ab243220',
                                rowId: '26d4312a-c894-48b5-a00f-fd746a61dbaa',
                                columnId: '9dc75a3a-e1d9-4a87-98fb-e6ccb33e7935',
                                rowOrder: 0,
                                columnOrder: 1,
                            },
                            {
                                id: '3b50d32a-1799-4dca-9fd7-8a095aa43baf',
                                rowId: '26d4312a-c894-48b5-a00f-fd746a61dbaa',
                                columnId: '63a854f3-2687-40f3-8c5e-beefa0324fc6',
                                rowOrder: 0,
                                columnOrder: 2,
                            },
                            {
                                id: '47df5de7-0440-4043-90d5-d278e9260360',
                                rowId: '26d4312a-c894-48b5-a00f-fd746a61dbaa',
                                columnId: '76933dd6-385f-441d-91af-97e79faaf1a9',
                                rowOrder: 0,
                                columnOrder: 0,
                            },
                            {
                                id: '1e4e6922-88f5-41df-947f-e0d0d47c157e',
                                rowId: 'da2025d6-c931-4084-9ce1-89e183b54ee4',
                                columnId: '76933dd6-385f-441d-91af-97e79faaf1a9',
                                rowOrder: 1,
                                columnOrder: 0,
                            },
                            {
                                id: '86bf9722-0039-4d92-88cd-e305249b062e',
                                rowId: 'da2025d6-c931-4084-9ce1-89e183b54ee4',
                                columnId: '63a854f3-2687-40f3-8c5e-beefa0324fc6',
                                rowOrder: 1,
                                columnOrder: 2,
                            },
                            {
                                id: 'e2b344d5-e03e-4e69-aecc-714de25dc57f',
                                rowId: 'da2025d6-c931-4084-9ce1-89e183b54ee4',
                                columnId: '9dc75a3a-e1d9-4a87-98fb-e6ccb33e7935',
                                rowOrder: 1,
                                columnOrder: 1,
                            },
                        ],
                        guestAnswer: {
                            gridIds: [
                                {
                                    id: '47df5de7-0440-4043-90d5-d278e9260360',
                                    rowId: '26d4312a-c894-48b5-a00f-fd746a61dbaa',
                                    columnId: '76933dd6-385f-441d-91af-97e79faaf1a9',
                                },
                                {
                                    id: 'e2b344d5-e03e-4e69-aecc-714de25dc57f',
                                    rowId: 'da2025d6-c931-4084-9ce1-89e183b54ee4',
                                    columnId: '9dc75a3a-e1d9-4a87-98fb-e6ccb33e7935',
                                },
                            ],
                        },
                    },
                },
                {
                    id: '5273e7d2-c99f-44b3-b8c3-e977c475c0e5',
                    label: 'Title of the file upload',
                    description: null,
                    require: true,
                    order: 4,
                    image: null,
                    attributeType: 'FILE_UPLOAD',
                    formId: '6894b510-46a1-4cb0-82cf-a6b917c97ba0',
                    singleQuestion: {
                        id: '59e572c5-87c4-4486-8afd-bc340bb2b42f',
                        score: 5,
                        singleQuestionValues: [],
                        fileConfig: {
                            id: 'edbb614b-4314-46c6-b4e1-6011efa5c05a',
                            maxNumOfFiles: 2,
                            maxFileSize: 10485760,
                            attributeId: '59e572c5-87c4-4486-8afd-bc340bb2b42f',
                        },
                        guestAnswer: {
                            fileValues: [
                                {
                                    id: '16a4d588-8f9f-430c-9e0f-0ea47e948586',
                                    bytes: 13264,
                                },
                                {
                                    id: '0ced3b23-29b6-4bcc-80ab-fd51b0c82cb0',
                                    bytes: 13264,
                                },
                            ],
                        },
                    },
                },
                {
                    id: '5e9d36af-d2e4-4c31-8493-4394986ca15c',
                    label: 'Title of the star',
                    description: null,
                    require: true,
                    order: 5,
                    image: null,
                    attributeType: 'STAR',
                    formId: '6894b510-46a1-4cb0-82cf-a6b917c97ba0',
                    singleQuestion: {
                        id: '870fdd1a-e636-49d7-a738-14f8f02a552b',
                        score: 5,
                        singleQuestionValues: [],
                        fileConfig: null,
                    },
                    guestAnswer: {
                        textValue: '3.5',
                    },
                },
                {
                    id: '8f09f75f-33cb-4229-9631-60d04eb78b90',
                    label: 'Title of the RADIO BUTTON',
                    description: 'Description of the RADIO BUTTON',
                    require: true,
                    order: 6,
                    image: null,
                    attributeType: 'RADIO_BUTTON',
                    formId: '6894b510-46a1-4cb0-82cf-a6b917c97ba0',
                    singleQuestion: {
                        id: '354c9fa0-4664-4db5-8478-9caee50f008d',
                        score: 5,
                        singleQuestionValues: [
                            {
                                id: 'e2127734-1c39-46ad-a2c9-7915bfcd745b',
                                value: '',
                                image: null,
                                isOther: true,
                            },
                            {
                                id: '8b187661-9956-464d-a5da-f4aef19abfe9',
                                value: 'radio value 2',
                                image: null,
                                isOther: false,
                            },
                            {
                                id: '336b1226-8897-4072-b470-302297081bab',
                                value: 'radio value 3',
                                image: null,
                                isOther: false,
                            },
                            {
                                id: '6736fba1-30fa-41e5-a53b-bdcc565fffb6',
                                value: 'radio value 1',
                                image: null,
                                isOther: false,
                            },
                        ],
                        fileConfig: null,
                        guestAnswer: {
                            choiceIds: [
                                {
                                    id: '6736fba1-30fa-41e5-a53b-bdcc565fffb6',
                                },
                            ],
                        },
                    },
                },
            ],
            image: null,
            totalScore: 40,
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
