import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FormCategory } from '../enums/form-category.enum';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { IdExists } from '../../../common/validator/uuid.validator';
import { Type } from 'class-transformer';
import { RawFile } from '../../raw-files/enitites/raw-file.entity';

export class CreateFormInput {
    @ApiProperty({
        example: 'Title of the form',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: 'Description of the form',
    })
    // @ValidateIf((d) => d.description !== null)
    @IsString()
    // @IsNotEmpty()
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

    @ApiPropertyOptional()
    @IsOptional()
    hasAnswer?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    canSeeCorrectAnswer?: boolean;

    @ApiProperty({
        enum: FormCategory,
        enumName: 'FormCategory',
    })
    @IsEnum(FormCategory)
    category: FormCategory;

    @ApiProperty({
        type: String,
    })
    @ValidateIf((d) => d.imageId !== null)
    @IsString()
    @IsNotEmpty()
    @IdExists(RawFile)
    imageId: string | null;
}
