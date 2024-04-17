import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { AttributeType } from '../enums/attribute-type.enum';
import { Image } from '../../images/entites/image.entity';
import { Form } from '../../forms/entities/form.entity';
import { IdExists } from '../../../common/validator/uuid.validator';
import { CreateSingleQuestionAttributeInput } from '../../single-questions/dto/create-single-question-attribute.input';
import { CreateGroupQuestionAttributeInput } from '../../group-questions/dto/create-group-question-attribute.input';
import { Type } from 'class-transformer';

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
    @IdExists(Image)
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

    // @ApiPropertyOptional({
    //     type: CreateSingleQuestionAttributeInput,
    // })
    // @Type(() => CreateSingleQuestionAttributeInput)
    // @IsOptional()
    // @ValidateNested()
    // singleQuestion?: CreateSingleQuestionAttributeInput;

    // @ApiPropertyOptional({
    //     type: CreateGroupQuestionAttributeInput,
    // })
    // @Type(() => CreateGroupQuestionAttributeInput)
    // @IsOptional()
    // @ValidateNested()
    // groupQuestion?: CreateGroupQuestionAttributeInput;
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
