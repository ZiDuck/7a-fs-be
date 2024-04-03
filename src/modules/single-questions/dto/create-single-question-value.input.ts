import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { IdExists } from '../../../common/validator/uuid.validator';
import { Image } from '../../images/entites/image.entity';

export class CreateSingleQuestionValueInput {
    @ApiProperty({
        example: 'Value of the option',
    })
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
    @IdExists(Image)
    imageId: string | null;

    @ApiProperty({
        type: Boolean,
    })
    @IsBoolean()
    @IsNotEmpty()
    isCorrect: boolean;
}
