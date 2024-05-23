export class RangeSummary {
    min: number;
    max: number;

    constructor(data: Partial<RangeSummary>) {
        Object.assign(this, data);
    }
}
