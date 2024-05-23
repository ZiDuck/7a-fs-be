import { AnswerResponseCheckbox } from './answer-response-checkbox.dto';
import { AnswerResponseFileUpload } from './answer-response-file-upload.dto';
import { RowResponse } from './row-response.dto';

export class AnswerSummary {
    totalResponses?: number;
    correctResponses?: number;
    answerResponses: (AnswerResponseCheckbox | AnswerResponseFileUpload | RowResponse)[];

    constructor(data: Partial<AnswerSummary>) {
        Object.assign(this, data);
        this.answerResponses = data.answerResponses!.map((a) => {
            if ('value' in a) {
                return new AnswerResponseCheckbox(a);
            } else if ('filename' in a) {
                return new AnswerResponseFileUpload(a);
            } else {
                return new RowResponse(a);
            }
        });
    }
}
