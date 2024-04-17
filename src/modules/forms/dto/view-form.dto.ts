import { Exclude, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidateIf, IsString, IsNotEmpty, IsOptional, IsInt, IsEnum } from 'class-validator';
import { IdExists } from '../../../common/validator/uuid.validator';
import { AttributeType } from '../../form-questions/enums/attribute-type.enum';
import { ImageOutput } from '../../images/dto/image.output';
import { Form } from '../entities/form.entity';
import { FormCategory } from '../enums/form-category.enum';
import { FormStatus } from '../enums/form-status.enum';

// @Expose()
// export class ViewForm extends GetFormAllFormQuestionsDto {
//     @Exclude()
//     createdBy: string;

//     @Exclude()
//     updatedBy: string;
// }

export class SingleQuestionFileConfigView {
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

    @Exclude()
    createdDate: Date;

    @Exclude()
    updatedDate: Date;

    @Exclude()
    deletedDate: Date;
}

export class SingleQuestionValueView {
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

    @Exclude()
    @ApiProperty({
        example: true,
    })
    isCorrect: boolean;
}

export class SingleQuestionView {
    @ApiProperty()
    id: string;

    @ApiProperty({ example: 1 })
    score: number;

    @ApiProperty({ example: false })
    isOther: boolean;

    @ApiProperty()
    questionId: string;

    @ApiProperty({
        type: [SingleQuestionValueView],
    })
    @Type(() => SingleQuestionValueView)
    singleQuestionValues: SingleQuestionValueView[];

    @ApiProperty({
        nullable: true,
        type: SingleQuestionFileConfigView,
    })
    @Type(() => SingleQuestionFileConfigView)
    fileConfig: SingleQuestionFileConfigView | null;
}

export class GroupQuestionView {
    @Type(() => GroupQuestionRowView)
    rows: GroupQuestionRowView[];

    @Type(() => GroupQuestionColumnView)
    columns: GroupQuestionColumnView[];

    @Exclude()
    @Type(() => GroupQuestionAnswerView)
    answers: GroupQuestionAnswerView[];
}

export class GroupQuestionRowView {
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

export class GroupQuestionColumnView {
    @ApiProperty()
    id: string;

    @ApiProperty()
    value: string;

    @ApiProperty()
    order: number;
}

export class GroupQuestionAnswerView {
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

    @Exclude()
    rowId: string;

    @Exclude()
    columnId: string;
}

export class FormQuestionView {
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

    @ApiPropertyOptional({
        type: SingleQuestionView,
    })
    @Type(() => SingleQuestionView)
    singleQuestion?: SingleQuestionView;

    @ApiPropertyOptional({
        type: GroupQuestionView,
    })
    @Type(() => GroupQuestionView)
    groupQuestion?: GroupQuestionView;
}

// export class SingleQuestionViewTemp extends FormQuestionView {
//     @ApiPropertyOptional({
//         type: SingleQuestionView,
//     })
//     @Type(() => SingleQuestionView)
//     singleQuestion?: SingleQuestionView;
// }

// export class GroupQuestionViewTemp extends FormQuestionView {
//     @ApiPropertyOptional({
//         type: GroupQuestionView,
//     })
//     @Type(() => GroupQuestionView)
//     groupQuestion?: GroupQuestionView;
// }

export class FormViewDto {
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

    @ApiProperty()
    @Type(() => FormQuestionView)
    formQuestions: FormQuestionView[];

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
