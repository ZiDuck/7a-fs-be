import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';

import { IdExists } from '../../../common/validator/uuid.validator';
import { Form } from '../../forms/entities/form.entity';
import { CreateGroupQuestionAttributeInput } from '../../group-questions/dto/create-group-question-attribute.input';
import { RawFile } from '../../raw-files/enitites/raw-file.entity';
import { CreateSingleQuestionAttributeInput } from '../../single-questions/dto/create-single-question-attribute.input';
import { AttributeType } from '../enums/attribute-type.enum';

export class CreateFormQuestionInput {
    @ApiProperty({
        example: 'Title of the question',
    })
    @IsString()
    @IsNotEmpty()
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
    require?: boolean;

    @ApiProperty({
        type: Number,
    })
    @IsNotEmpty()
    @IsInt()
    order: number;

    @ApiProperty({
        nullable: true,
        type: String,
    })
    @ValidateIf((d) => d.imageId !== null)
    @IsString()
    @IsNotEmpty()
    @IdExists(RawFile)
    imageId: string | null;

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

export class CreateSingleQuestionFormInput extends CreateFormQuestionInput {
    @ApiProperty({
        type: CreateSingleQuestionAttributeInput,
    })
    @Type(() => CreateSingleQuestionAttributeInput)
    @ValidateNested()
    singleQuestion: CreateSingleQuestionAttributeInput;
}

export class CreateGroupQuestionFormInput extends CreateFormQuestionInput {
    @ApiProperty({
        type: CreateGroupQuestionAttributeInput,
    })
    @Type(() => CreateGroupQuestionAttributeInput)
    @ValidateNested()
    groupQuestion: CreateGroupQuestionAttributeInput;
}
