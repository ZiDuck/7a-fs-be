import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { CreateGroupQuestionAnswerInput } from './create-group-question-answer.input';
import { CreateGroupQuestionColumnInput } from './create-group-question-column.input';
import { CreateGroupQuestionRowInput } from './create-group-question-row.input';

export class CreateGroupQuestionAttributeInput {
    @ApiProperty({
        type: [CreateGroupQuestionRowInput],
    })
    @Type(() => CreateGroupQuestionRowInput)
    @ValidateNested()
    rows: CreateGroupQuestionRowInput[];

    @ApiProperty({
        type: [CreateGroupQuestionColumnInput],
    })
    @Type(() => CreateGroupQuestionColumnInput)
    @ValidateNested()
    columns: CreateGroupQuestionColumnInput[];

    @ApiProperty({
        type: [CreateGroupQuestionAnswerInput],
    })
    @Type(() => CreateGroupQuestionAnswerInput)
    @ValidateNested()
    answers: CreateGroupQuestionAnswerInput[];
}
