import { ApiProperty } from '@nestjs/swagger';

export class MissedQuestion {
    @ApiProperty()
    id: string;

    @ApiProperty()
    label: string;

    @ApiProperty()
    totalResponses: number;

    @ApiProperty()
    correctResponses: number;

    constructor(data: Partial<MissedQuestion>) {
        Object.assign(this, data);
    }
}
