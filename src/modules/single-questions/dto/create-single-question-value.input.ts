import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
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

    @ApiProperty({
        type: Boolean,
    })
    @IsBoolean()
    @IsNotEmpty()
    isCorrect: boolean;

    @ApiPropertyOptional()
    @ValidateIf((o) => o.isOther !== undefined)
    @IsBoolean()
    isOther?: boolean;
}
