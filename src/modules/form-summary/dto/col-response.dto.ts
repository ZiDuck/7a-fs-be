export class ColResponse {
    colValue: string;
    isCorrect: boolean;
    count: number;
    percentage: number;

    constructor(data: Partial<ColResponse>) {
        Object.assign(this, data);
    }
}
