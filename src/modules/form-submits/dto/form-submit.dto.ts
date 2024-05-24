import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

import { IdExists } from '../../../common/validator/uuid.validator';
import { AttributeType, GROUP_QUESTION_TYPES, SINGLE_QUESTION_TYPES } from '../../form-questions/enums/attribute-type.enum';
import { Form } from '../../forms/entities/form.entity';
import { FormCategory } from '../../forms/enums/form-category.enum';
import { FormStatus } from '../../forms/enums/form-status.enum';
import { ImageOutput } from '../../images/dto/image.output';

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
    summaries?: GuestSelectSummary[] | GuestTextSummary;
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
        example: [
            {
                id: 'ebca15ca-5001-4024-aeee-9fb581e1c51a',
                label: 'Title of the CHECKBOX BUTTON',
                description: 'Description of the CHECKBOX BUTTON',
                require: true,
                order: 0,
                image: null,
                attributeType: 'DROPDOWN',
                formId: '8cf0fdd4-92f4-4797-a02a-a662ec581794',
                singleQuestion: {
                    id: 'f181082d-c81f-4dc2-80d5-bdfa52aee6ec',
                    score: 1,
                    isOther: false,
                    singleQuestionValues: [
                        {
                            id: '34de553b-909a-4ebf-8e78-51a788b55988',
                            value: 'checkbox value 1',
                            image: null,
                            isCorrect: true,
                        },
                        {
                            id: '4c9d1d39-f5aa-418c-9abe-d53a9cabb637',
                            value: 'checkbox value 2',
                            image: null,
                            isCorrect: false,
                        },
                        {
                            id: 'c5e2ff31-a82e-47c3-a68e-906acd3078d6',
                            value: 'checkbox value 3',
                            image: null,
                            isCorrect: false,
                        },
                    ],
                    fileConfig: null,
                    guestAnswer: { choiceIds: ['c5e2ff31-a82e-47c3-a68e-906acd3078d6'] },
                },
            },
            {
                id: 'ee5b0d69-a6ec-461c-81ab-12589ccb0ff2',
                label: 'Title of the question',
                description: 'Description of the question',
                require: true,
                order: 2,
                image: null,
                attributeType: 'PARAGRAPH',
                formId: '8cf0fdd4-92f4-4797-a02a-a662ec581794',
                singleQuestion: {
                    id: 'a2003ebb-0158-4f6a-9a42-61ab9b962980',
                    score: 0,
                    isOther: false,
                    singleQuestionValues: [
                        {
                            id: 'ef3231e5-1b15-4080-b3eb-dbdbdf899f42',
                            value: 'Cau tra loi dung 1',
                            image: null,
                            isCorrect: true,
                        },
                        {
                            id: '9be589d6-f328-4d65-a654-09cb8ff27d12',
                            value: 'Cau tra loi dung 2',
                            image: null,
                            isCorrect: true,
                        },
                    ],
                    fileConfig: null,
                    guestAnswer: { textValue: 'abc' },
                },
            },
            {
                id: '19ebca60-bb44-488f-baa0-40289915c106',
                label: 'Title of the multi choice',
                description: 'Description of multi choice',
                require: true,
                order: 3,
                image: null,
                attributeType: 'RADIO_GRID',
                formId: '8cf0fdd4-92f4-4797-a02a-a662ec581794',
                groupQuestion: {
                    rows: [
                        {
                            id: '8583647d-c970-42a0-afb6-7ec367948be8',
                            score: 0,
                            value: 'Row 1',
                            order: 0,
                        },
                        {
                            id: '41baaf7e-669a-4b11-9751-aa3761554171',
                            score: 0,
                            value: 'Row 2',
                            order: 1,
                        },
                    ],
                    columns: [
                        {
                            id: 'e1e5cf6f-6325-4ded-9504-a46d5cfe6ddb',
                            value: 'Column 3',
                            order: 2,
                        },
                        {
                            id: '14e436f9-d1fc-4f8d-84bc-d8264945be91',
                            value: 'Column 1',
                            order: 0,
                        },
                        {
                            id: '96026504-ac1b-49b4-b5a3-0d7a57aea49c',
                            value: 'Column 2',
                            order: 1,
                        },
                        {
                            id: 'd543f79a-9fe6-48fe-a647-f61ada07620e',
                            value: 'Column 4',
                            order: 3,
                        },
                    ],
                    answers: [
                        {
                            id: '83d5f357-e8a2-4777-9580-6f621a3c50d5',
                            isCorrect: true,
                            rowId: '8583647d-c970-42a0-afb6-7ec367948be8',
                            columnId: '14e436f9-d1fc-4f8d-84bc-d8264945be91',
                            rowOrder: 0,
                            columnOrder: 0,
                        },
                        {
                            id: 'b6467df1-8af0-4ee0-b91e-ef7a1acdb457',
                            isCorrect: true,
                            rowId: '41baaf7e-669a-4b11-9751-aa3761554171',
                            columnId: '96026504-ac1b-49b4-b5a3-0d7a57aea49c',
                            rowOrder: 1,
                            columnOrder: 1,
                        },
                    ],
                    guestAnswer: [
                        {
                            rowId: '41baaf7e-669a-4b11-9751-aa3761554171',
                            columnId: '14e436f9-d1fc-4f8d-84bc-d8264945be91',
                        },
                        {
                            rowId: '8583647d-c970-42a0-afb6-7ec367948be8',
                            columnId: 'd543f79a-9fe6-48fe-a647-f61ada07620e',
                        },
                    ],
                },
            },
            {
                id: 'ca5e90a7-bba1-4a66-b1a8-ccd67f404ea8',
                label: 'Title of the file upload',
                description: null,
                require: true,
                order: 4,
                image: null,
                attributeType: 'FILE_UPLOAD',
                formId: '8cf0fdd4-92f4-4797-a02a-a662ec581794',
                singleQuestion: {
                    id: '58f83751-a22e-4308-9f4a-a979fcac2fef',
                    score: 0,
                    isOther: false,
                    singleQuestionValues: [],
                    fileConfig: {
                        id: '83fb8032-b371-4178-9d11-d8a9e8d91c0f',
                        createdDate: '2024-04-11T22:06:04.049Z',
                        updatedDate: '2024-04-11T22:06:04.049Z',
                        maxNumOfFiles: 1,
                        maxFileSize: 10,
                        attributeId: '58f83751-a22e-4308-9f4a-a979fcac2fef',
                        deletedDate: null,
                    },
                    guestAnswer: ['public/feedback-system/images/ojjsfjmt2saxtkrh245k.png'],
                },
            },
        ],
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
