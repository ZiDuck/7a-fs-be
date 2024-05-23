export class MissedQuestion {
    id: string;
    label: string;
    totalResponses: number;
    correctResponses: number;

    constructor(data: Partial<MissedQuestion>) {
        Object.assign(this, data);
    }
}
