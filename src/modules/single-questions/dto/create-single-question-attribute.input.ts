import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { CreateSingleQuestionValueInput } from './create-single-question-value.input';
import { Type } from 'class-transformer';
import { CreateSingleQuestionFileConfigInput } from './create-single-question-file-config.input';

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

    @ApiPropertyOptional({
        type: CreateSingleQuestionFileConfigInput,
    })
    @Type(() => CreateSingleQuestionFileConfigInput)
    @IsOptional()
    @ValidateNested()
    fileConfig?: CreateSingleQuestionFileConfigInput;
}
