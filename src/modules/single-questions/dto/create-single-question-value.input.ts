import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { IdExists } from '../../../common/validator/uuid.validator';
import { Image } from '../../images/entites/image.entity';

export class CreateSingleQuestionValueInput {
    @ApiProperty({
        nullable: true,
        example: 'Value of the question',
    })
    @ValidateIf((d) => d.value !== null)
    @IsString()
    @IsNotEmpty()
    value: string | null;

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
        nullable: true,
        type: Boolean,
    })
    @ValidateIf((d) => d.value !== null)
    @IsString()
    @IsNotEmpty()
    isCorrect: boolean | null;
}
