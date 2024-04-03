import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { CreateGroupQuestionRowInput } from './create-group-question-row.input';
import { CreateGroupQuestionColumnInput } from './create-group-question-column.input';
import { CreateGroupQuestionAnswerInput } from './create-group-question-answer.input';
import { Type } from 'class-transformer';

export class CreateGroupQuestionAttributeInput {
    @ApiProperty({
        type: [CreateGroupQuestionRowInput],
    })
    @Type(() => CreateGroupQuestionRowInput)
    @ValidateNested()
    groupQuestionRows: CreateGroupQuestionRowInput[];

    @ApiProperty({
        type: [CreateGroupQuestionColumnInput],
    })
    @Type(() => CreateGroupQuestionColumnInput)
    @ValidateNested()
    groupQuestionColumns: CreateGroupQuestionColumnInput[];

    @ApiProperty({
        type: [CreateGroupQuestionAnswerInput],
    })
    @Type(() => CreateGroupQuestionAnswerInput)
    @ValidateNested()
    correctAnswers: CreateGroupQuestionAnswerInput[];
}
