import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';
import { CreateSingleQuestionValueInput } from './create-single-question-value.input';

export class CreateSingleQuestionAttributeInput {
    @ApiProperty({
        nullable: true,
        example: 1,
    })
    @ValidateIf((d) => d.score !== null)
    @IsNumber()
    @IsNotEmpty()
    score: number | null;

    @ApiPropertyOptional()
    @IsBoolean()
    isOther?: boolean;

    @ApiProperty({
        type: [CreateSingleQuestionValueInput],
    })
    singleQuestionValues: CreateSingleQuestionValueInput[];
}
