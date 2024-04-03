import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsNumber, ValidateNested } from 'class-validator';
import { CreateSingleQuestionValueInput } from './create-single-question-value.input';
import { Type } from 'class-transformer';

export class CreateSingleQuestionAttributeInput {
    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    @IsDefined()
    score: number;

    @ApiProperty()
    @IsBoolean()
    isOther: boolean;

    @ApiProperty({
        type: [CreateSingleQuestionValueInput],
    })
    @Type(() => CreateSingleQuestionValueInput)
    @ValidateNested()
    singleQuestionValues: CreateSingleQuestionValueInput[];
}
