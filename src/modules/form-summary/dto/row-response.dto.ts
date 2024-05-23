import { ColResponse } from './col-response.dto';

export class RowResponse {
    rowValue: string;
    totalResponses: number;
    correctResponses: number;
    colResponses: ColResponse[];

    constructor(data: Partial<RowResponse>) {
        Object.assign(this, data);
        this.colResponses = data.colResponses!.map((c) => new ColResponse(c));
    }
}
