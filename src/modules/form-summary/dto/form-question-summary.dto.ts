import { AttributeType } from '../../form-questions/enums/attribute-type.enum';
import { AnswerSummary } from './answer-summary.dto';

export class FormQuestionSummary {
    id: string;
    label: string;
    description: string | null;
    order: number;
    attributeType: AttributeType;
    formId: string;
    answerSummary: AnswerSummary;

    constructor(data: Partial<FormQuestionSummary>) {
        Object.assign(this, data);
        this.answerSummary = new AnswerSummary(data.answerSummary!);
    }
}
