import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';

import { IdExists } from '../../../common/validator/uuid.validator';
import { RawFile } from '../../raw-files/enitites/raw-file.entity';

export class CreateSingleQuestionValueInput {
    @ApiProperty({
        example: 'Value of the option',
    })
    @ValidateIf((o: CreateSingleQuestionValueInput) => !o.isOther)
    @IsString()
    @IsNotEmpty()
    value: string;

    @ApiProperty({
        nullable: true,
        type: String,
    })
    @ValidateIf((d) => d.imageId !== null)
    @IsString()
    @IsNotEmpty()
    @IdExists(RawFile)
    imageId: string | null;

    @ApiPropertyOptional({
        type: Boolean,
    })
    @ValidateIf((o) => o.isCorrect !== undefined)
    @IsBoolean()
    isCorrect?: boolean;

    @ApiPropertyOptional()
    @ValidateIf((o) => o.isOther !== undefined)
    @IsBoolean()
    isOther?: boolean;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    order: number;
}
