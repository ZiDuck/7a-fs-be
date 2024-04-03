import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { CreateFormQuestionInput } from './create-form-question.input';
import { Type } from 'class-transformer';

export class CreateFormQuestionsInput {
    @ApiProperty({
        type: [CreateFormQuestionInput],
    })
    @Type(() => CreateFormQuestionInput)
    @ValidateNested()
    formQuestions: CreateFormQuestionInput[];
}
