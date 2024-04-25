import { Type } from 'class-transformer';
import { AttributeType, GROUP_QUESTION_TYPES, SINGLE_QUESTION_TYPES } from '../../form-questions/enums/attribute-type.enum';
import { ImageOutput } from '../../images/dto/image.output';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { FormCategory } from '../../forms/enums/form-category.enum';
import { FormStatus } from '../../forms/enums/form-status.enum';
import { IdExists } from '../../../common/validator/uuid.validator';
import { Form } from '../../forms/entities/form.entity';

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
    id: string;

    @ApiProperty({
        example: 'Value of the question',
    })
    value: string;

    @ApiProperty({
        type: ImageOutput,
        nullable: true,
    })
    image: ImageOutput | null;

    @ApiProperty({
        example: true,
    })
    isOther: boolean;
}

export class CreateGuestAnswerId {
    @ApiProperty()
    id: string;
}

export class CreateGuestFileValue {
    @ApiProperty()
    id: string;

    @ApiProperty()
    bytes: number;
}

export class CreateGuestAnswerFormSingle {
    @ApiPropertyOptional()
    choiceIds?: CreateGuestAnswerId[];

    @ApiPropertyOptional()
    textValue?: string;

    @ApiPropertyOptional()
    fileValues?: CreateGuestFileValue[];
}

export class CreateSingleQuestionSubmit {
    @ApiProperty()
    id: string;

    @ApiProperty({ example: 1 })
    score: number;

    @ApiProperty({ example: false })
    isOther: boolean;

    @ApiProperty()
    questionId: string;

    @ApiProperty({
        type: [CreateSingleQuestionValueSubmit],
    })
    @Type(() => CreateSingleQuestionValueSubmit)
    singleQuestionValues: CreateSingleQuestionValueSubmit[];

    @ApiProperty({
        nullable: true,
        type: CreateSingleQuestionFileConfigSubmit,
    })
    @Type(() => CreateSingleQuestionFileConfigSubmit)
    fileConfig: CreateSingleQuestionFileConfigSubmit | null;

    @ApiProperty({
        description: 'Các câu trả lời có thể là một mảng các đối tượng GuestAnswerFormSingle hoặc một mảng các chuỗi ký tự',
        type: CreateGuestAnswerFormSingle,
        isArray: true,
        example: [{ id: 'uuid' }],
    })
    @Type(() => CreateGuestAnswerFormSingle)
    guestAnswer: CreateGuestAnswerFormSingle;
}

export class CreateGridId {
    gridIds: CreateGuestAnswerFormGroup[];
}

export class CreateGroupQuestionSubmit {
    @Type(() => CreateGroupQuestionRowSubmit)
    rows: CreateGroupQuestionRowSubmit[];

    @Type(() => CreateGroupQuestionColumnSubmit)
    columns: CreateGroupQuestionColumnSubmit[];

    // @Type(() => GroupQuestionAnswerSubmit)
    // answers: GroupQuestionAnswerSubmit[];

    @Type(() => CreateGridId)
    guestAnswer: CreateGridId;
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
    rowId: string;

    columnId: string;
}

export class CreateFormQuestionSubmit {
    @ApiProperty()
    id: string;

    @ApiProperty({
        example: 'Title of the question',
    })
    label: string;

    @ApiProperty({
        nullable: true,
        example: 'Description of the question',
    })
    @ValidateIf((d) => d.description !== null)
    @IsString()
    @IsNotEmpty()
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
    @ApiPropertyOptional({
        type: CreateSingleQuestionSubmit,
    })
    @Type(() => CreateSingleQuestionSubmit)
    singleQuestion?: CreateSingleQuestionSubmit;
}

export class CreateGroupQuestionSubmitTemp extends CreateFormQuestionSubmit {
    @ApiPropertyOptional({
        type: CreateGroupQuestionSubmit,
    })
    @Type(() => CreateGroupQuestionSubmit)
    groupQuestion?: CreateGroupQuestionSubmit;
}

export class CreateFormSubmitDto {
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
        // type: [FormQuestionSubmit],
        // discriminator: {
        //     propertyName: 'attributeType',
        //     mapping: {
        //         ...SINGLE_QUESTION_TYPES.reduce((acc, value) => ({ ...acc, [value]: 'SingleQuestionSubmitTemp' }), {}),
        //         ...GROUP_QUESTION_TYPES.reduce((acc, value) => ({ ...acc, [value]: 'GroupQuestionSubmitTemp' }), {}),
        //     },
        // },
        example: {
            id: 'f453707a-86f2-4280-bf8a-7cad12eb87ea',
            title: 'Standard Form',
            description: null,
            startSurvey: '2024-04-03T17:00:00.000Z',
            status: 'ACCEPTED',
            hasAnswer: true,
            category: 'PATIENT_CATEGORY',
            version: 0,
            formQuestions: [
                {
                    id: '9c2a4f19-65ca-4ed5-adf4-b6a2692c2210',
                    label: 'Title of the CHECKBOX BUTTON',
                    description: 'Description of the CHECKBOX BUTTON',
                    require: true,
                    order: 0,
                    image: null,
                    attributeType: 'DROPDOWN',
                    formId: 'f453707a-86f2-4280-bf8a-7cad12eb87ea',
                    singleQuestion: {
                        id: 'd18e3239-7051-408f-8784-385a9a36e559',
                        score: 1,
                        isOther: false,
                        singleQuestionValues: [
                            {
                                id: '56e93bef-2eb2-4057-9740-c288184a6434',
                                value: 'checkbox value 2',
                                image: null,
                            },
                            {
                                id: '5ff49055-d8f5-4170-b93a-276ea6ec3164',
                                value: 'checkbox value 3',
                                image: null,
                            },
                            {
                                id: '98ca2f81-1842-4db0-bdb2-1154434cd744',
                                value: 'checkbox value 1',
                                image: null,
                            },
                        ],
                        fileConfig: null,
                        guestAnswer: {
                            choiceIds: [
                                {
                                    id: '56e93bef-2eb2-4057-9740-c288184a6434',
                                },
                            ],
                        },
                    },
                },
                {
                    id: '544a7e54-3758-4afe-ba07-df3337657f1c',
                    label: 'Title of the dropdown',
                    description: 'Description of the dropdown',
                    require: true,
                    order: 1,
                    image: null,
                    attributeType: 'TEXT_BOX',
                    formId: 'f453707a-86f2-4280-bf8a-7cad12eb87ea',
                    singleQuestion: {
                        id: '72c2d46f-bed0-4934-891b-090f3bab5e3c',
                        score: 0,
                        isOther: false,
                        singleQuestionValues: [
                            {
                                id: 'd923881e-7331-4e60-9951-88df0ecf3228',
                                value: 'true value',
                                image: null,
                            },
                        ],
                        fileConfig: null,
                        guestAnswer: {
                            textValue: 'hello everyone',
                        },
                    },
                },
                {
                    id: 'bee075cb-184e-46b8-b450-40f436731130',
                    label: 'Title of the question',
                    description: 'Description of the question',
                    require: true,
                    order: 2,
                    image: null,
                    attributeType: 'PARAGRAPH',
                    formId: 'f453707a-86f2-4280-bf8a-7cad12eb87ea',
                    singleQuestion: {
                        id: '755c923b-c696-4a9a-86e9-439c28dbcd5f',
                        score: 0,
                        isOther: false,
                        singleQuestionValues: [
                            {
                                id: '8c01c218-fe19-4911-9775-f0b3dae65fd7',
                                value: 'Cau tra loi dung 1',
                                image: null,
                            },
                            {
                                id: '0f84fe98-0d2a-4044-9c72-e140a3417260',
                                value: 'Cau tra loi dung 2',
                                image: null,
                            },
                        ],
                        fileConfig: null,
                        guestAnswer: {
                            textValue: 'hello everyone',
                        },
                    },
                },
                {
                    id: 'b08f7fd5-8adb-4385-a2b1-da978509978b',
                    label: 'Title of the multi choice',
                    description: 'Description of multi choice',
                    require: true,
                    order: 3,
                    image: null,
                    attributeType: 'RADIO_GRID',
                    formId: 'f453707a-86f2-4280-bf8a-7cad12eb87ea',
                    groupQuestion: {
                        rows: [
                            {
                                id: '6499d05b-e83c-4557-af93-e5b171c5bafd',
                                score: 0,
                                value: 'Row 1',
                                order: 0,
                            },
                            {
                                id: 'a9871f58-2c55-44ba-9ea4-672ea1dbb4c1',
                                score: 0,
                                value: 'Row 2',
                                order: 1,
                            },
                        ],
                        totalScore: 0,
                        columns: [
                            {
                                id: '01703735-4428-44ad-b8f8-71dcac797f3a',
                                value: 'Column 1',
                                order: 0,
                            },
                            {
                                id: '221efa62-e700-41de-bd78-c3dbd695c74d',
                                value: 'Column 2',
                                order: 1,
                            },
                            {
                                id: '935ef706-b751-439c-8922-2c5c80291c98',
                                value: 'Column 3',
                                order: 2,
                            },
                        ],
                        guestAnswer: [
                            {
                                rowId: '6499d05b-e83c-4557-af93-e5b171c5bafd',

                                columnId: '01703735-4428-44ad-b8f8-71dcac797f3a',
                            },
                            {
                                rowId: 'a9871f58-2c55-44ba-9ea4-672ea1dbb4c1',

                                columnId: '935ef706-b751-439c-8922-2c5c80291c98',
                            },
                        ],
                    },
                },
                {
                    id: 'f6c6a12a-a433-4c9a-ac51-e8edd3fb7f5d',
                    label: 'Title of the file upload',
                    description: null,
                    require: true,
                    order: 4,
                    image: null,
                    attributeType: 'FILE_UPLOAD',
                    formId: 'f453707a-86f2-4280-bf8a-7cad12eb87ea',
                    singleQuestion: {
                        id: '09bdba7b-bbbd-4e82-a384-7b806776e027',
                        score: 0,
                        isOther: false,
                        singleQuestionValues: [],
                        fileConfig: {
                            id: 'ce4dc57b-68c2-47c8-867d-4e35e1c2a7c4',
                            maxNumOfFiles: 2,
                            maxFileSize: 10485760,
                            attributeId: '09bdba7b-bbbd-4e82-a384-7b806776e027',
                        },
                        guestAnswer: {
                            fileValues: [
                                {
                                    id: '4bd12abb-c6db-424a-b904-0043d0085cfd',
                                    bytes: 620956,
                                },
                                {
                                    id: 'df220a2b-63a3-4f10-be36-f3e174e4ddb3',
                                    bytes: 8822,
                                },
                            ],
                        },
                    },
                },
                {
                    id: '0ab0e403-8526-48ba-825b-5cb3d8b85629',
                    label: 'Title of the star',
                    description: null,
                    require: true,
                    order: 5,
                    image: null,
                    attributeType: 'STAR',
                    formId: 'f453707a-86f2-4280-bf8a-7cad12eb87ea',
                    singleQuestion: {
                        id: '5eaf177b-5f09-4ae8-b0b6-3facf284991a',
                        score: 0,
                        isOther: false,
                        singleQuestionValues: [],
                        fileConfig: null,
                    },
                    guestAnswer: {
                        textValue: '3.5',
                    },
                },
            ],
            image: null,
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
    formQuestions: CreateFormQuestionSubmit[];
}
