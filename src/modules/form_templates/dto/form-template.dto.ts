import { Exclude, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum } from 'class-validator';
import { AttributeType } from '../../form-questions/enums/attribute-type.enum';
import { ImageOutput } from '../../images/dto/image.output';
import { FormCategory } from '../../forms/enums/form-category.enum';
import { FormStatus } from '../../forms/enums/form-status.enum';

export class SingleQuestionFileConfigTemplate {
    @Exclude()
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

    @Exclude()
    createdDate: Date;

    @Exclude()
    updatedDate: Date;

    @Exclude()
    deletedDate: Date;
}

export class SingleQuestionValueTemplate {
    @Exclude()
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
    isCorrect: boolean;

    @ApiProperty({ example: false })
    isOther: boolean;

    @ApiProperty()
    order: number;
}

export class SingleQuestionTemplate {
    @Exclude()
    id: string;

    @ApiProperty({ example: 1 })
    score: number;

    // @ApiProperty()
    @Exclude()
    questionId: string;

    @ApiProperty({
        type: [SingleQuestionValueTemplate],
    })
    @Type(() => SingleQuestionValueTemplate)
    singleQuestionValues: SingleQuestionValueTemplate[];

    @ApiProperty({
        nullable: true,
        type: SingleQuestionFileConfigTemplate,
    })
    @Type(() => SingleQuestionFileConfigTemplate)
    fileConfig: SingleQuestionFileConfigTemplate | null;
}

export class GroupQuestionTemplate {
    @Type(() => GroupQuestionRowTemplate)
    rows: GroupQuestionRowTemplate[];

    @Type(() => GroupQuestionColumnTemplate)
    columns: GroupQuestionColumnTemplate[];

    @Type(() => GroupQuestionAnswerTemplate)
    answers: GroupQuestionAnswerTemplate[];
}

export class GroupQuestionRowTemplate {
    @Exclude()
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

export class GroupQuestionColumnTemplate {
    @Exclude()
    id: string;

    @ApiProperty()
    value: string;

    @ApiProperty()
    order: number;
}

export class GroupQuestionAnswerTemplate {
    @Exclude()
    id: string;

    @ApiProperty()
    rowOrder: number;

    @ApiProperty()
    columnOrder: number;

    @ApiProperty({
        example: true,
    })
    isCorrect: boolean;

    @Exclude()
    rowId: string;

    @Exclude()
    columnId: string;
}

export class FormQuestionTemplate {
    @Exclude()
    id: string;

    @ApiProperty({
        example: 'Title of the question',
    })
    label: string;

    @ApiProperty({
        example: 'Description of the question',
    })
    @IsString()
    description: string;

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

    // @ApiProperty({
    //     type: String,
    // })
    // @IsString()
    // @IsNotEmpty()
    // @IdExists(Form)
    @Exclude()
    formId: string;

    @ApiPropertyOptional({
        type: SingleQuestionTemplate,
    })
    @Type(() => SingleQuestionTemplate)
    singleQuestion?: SingleQuestionTemplate;

    @ApiPropertyOptional({
        type: GroupQuestionTemplate,
    })
    @Type(() => GroupQuestionTemplate)
    groupQuestion?: GroupQuestionTemplate;
}

// export class SingleQuestionTemplateTemp extends FormQuestionTemplate {
//     @ApiPropertyOptional({
//         type: SingleQuestionTemplate,
//     })
//     @Type(() => SingleQuestionTemplate)
//     singleQuestion?: SingleQuestionTemplate;
// }

// export class GroupQuestionTemplateTemp extends FormQuestionTemplate {
//     @ApiPropertyOptional({
//         type: GroupQuestionTemplate,
//     })
//     @Type(() => GroupQuestionTemplate)
//     groupQuestion?: GroupQuestionTemplate;
// }

export class FormTemplateDto {
    @ApiProperty({
        example: 'uuid',
    })
    @Exclude()
    id: string;

    @ApiProperty({
        example: 'Title of the form',
    })
    title: string;

    @ApiProperty({
        example: 'Description of the form',
    })
    description: string;

    @ApiProperty()
    startSurvey: Date;

    @ApiProperty({
        enum: FormStatus,
    })
    @Exclude()
    status: FormStatus;

    @ApiProperty()
    hasAnswer: boolean;

    @ApiProperty()
    canSeeCorrectAnswer: boolean;

    @ApiProperty({
        enum: FormCategory,
    })
    category: FormCategory;

    // @ApiProperty()
    @Exclude()
    version: number;

    @ApiProperty({
        type: ImageOutput,
        nullable: true,
    })
    image: ImageOutput | null;

    @ApiProperty()
    @Type(() => FormQuestionTemplate)
    formQuestions: FormQuestionTemplate[];

    @Exclude()
    imageId: string;

    @Exclude()
    createdBy: string;

    @Exclude()
    updatedBy: string;

    @Exclude()
    createdDate: Date;

    @Exclude()
    updatedDate: Date;

    @Exclude()
    deletedDate: Date;
}
