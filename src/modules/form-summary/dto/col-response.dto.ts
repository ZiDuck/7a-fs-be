import { ApiProperty } from '@nestjs/swagger';

export class ColResponse {
    @ApiProperty()
    colValue: string;

    @ApiProperty()
    isCorrect: boolean;

    @ApiProperty()
    count: number;

    @ApiProperty()
    percentage: number;

    constructor(data: Partial<ColResponse>) {
        Object.assign(this, data);
    }
}
