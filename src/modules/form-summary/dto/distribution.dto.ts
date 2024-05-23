export class Distribution {
    range: string;
    count: number;

    constructor(data: Partial<Distribution>) {
        Object.assign(this, data);
    }
}
