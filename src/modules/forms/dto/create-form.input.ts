import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FormCategory } from '../enums/form-category.enum';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { Image } from '../../images/entites/image.entity';
import { IdExists } from '../../../common/validator/uuid.validator';
import { Type } from 'class-transformer';

export class CreateFormInput {
    @ApiProperty({
        example: 'Title of the form',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        nullable: true,
        example: 'Description of the form',
    })
    @ValidateIf((d) => d.description !== null)
    @IsString()
    @IsNotEmpty()
    description: string | null;

    @ApiProperty({
        type: Date,
        nullable: true,
    })
    @ValidateIf((d) => d.startSurvey !== null)
    @Type(() => Date)
    @IsNotEmpty()
    @IsDate()
    startSurvey: Date | null;

    @ApiPropertyOptional()
    @IsOptional()
    hasAnswer?: boolean;

    @ApiProperty({
        enum: FormCategory,
        enumName: 'FormCategory',
    })
    @IsEnum(FormCategory)
    category: FormCategory;

    @ApiProperty({
        nullable: true,
        type: String,
    })
    @ValidateIf((d) => d.imageId !== null)
    @IsString()
    @IsNotEmpty()
    @IdExists(Image)
    imageId: string | null;
}
