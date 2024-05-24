import { ApiProperty } from '@nestjs/swagger';

import { ColResponse } from './col-response.dto';

export class RowResponse {
    @ApiProperty()
    rowValue: string;

    @ApiProperty()
    totalResponses: number;

    @ApiProperty()
    correctResponses: number;

    @ApiProperty({
        type: [ColResponse],
    })
    colResponses: ColResponse[];

    constructor(data: Partial<RowResponse>) {
        Object.assign(this, data);
        this.colResponses = data.colResponses!.map((c) => new ColResponse(c));
    }
}
