import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { GetGroupQuestionAnswer } from './get-group-question-answer.dto';
import { GetGroupQuestionColumn } from './get-group-question-column.dto';
import { GetGroupQuestionRow } from './get-group-question-row.dto';

export class GetGroupQuestionValue {
    @ApiProperty({
        type: [GetGroupQuestionRow],
    })
    @Type(() => GetGroupQuestionRow)
    rows: GetGroupQuestionRow[];

    @ApiProperty({
        type: [GetGroupQuestionColumn],
    })
    @Type(() => GetGroupQuestionColumn)
    columns: GetGroupQuestionColumn[];

    @ApiPropertyOptional({
        type: [GetGroupQuestionAnswer],
    })
    @Type(() => GetGroupQuestionAnswer)
    answers: GetGroupQuestionAnswer[];
}
