import { FormQuestionSummary } from './form-question-summary.dto';
import { Insights } from './insights.dto';
import { MissedQuestion } from './miss-question.dto';

export class FormSummaryDto {
    id: string;
    title: string;
    description: string | null;
    insights: Insights;
    missedQuestions: MissedQuestion[];
    questionSummaries: FormQuestionSummary[];

    constructor(data: Partial<FormSummaryDto>) {
        Object.assign(this, data);
        this.insights = new Insights(data.insights!);
        this.missedQuestions = data.missedQuestions!.map((m) => new MissedQuestion(m));
        this.questionSummaries = data.questionSummaries!.map((f) => new FormQuestionSummary(f));
    }
}
