export class AnswerResponseCheckbox {
    value: string;
    isCorrect: boolean;
    count: number;
    percentage: number;

    constructor(data: Partial<AnswerResponseCheckbox>) {
        Object.assign(this, data);
    }
}
