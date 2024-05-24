import { ApiProperty } from '@nestjs/swagger';

import { FormQuestionSummary } from './form-question-summary.dto';
import { Insights } from './insights.dto';
import { MissedQuestion } from './miss-question.dto';

export class FormSummaryDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty({
        type: Insights,
    })
    insights: Insights;

    @ApiProperty({
        type: MissedQuestion,
        isArray: true,
    })
    missedQuestions: MissedQuestion[];

    @ApiProperty({
        type: FormQuestionSummary,
        isArray: true,
    })
    questionSummaries: FormQuestionSummary[];

    constructor(data: Partial<FormSummaryDto>) {
        Object.assign(this, data);
        this.insights = new Insights(data.insights!);
        this.missedQuestions = data.missedQuestions!.map((m) => new MissedQuestion(m));
        this.questionSummaries = data.questionSummaries!.map((f) => new FormQuestionSummary(f));
    }
}
