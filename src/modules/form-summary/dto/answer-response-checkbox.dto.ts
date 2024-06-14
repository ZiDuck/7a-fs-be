import { ApiProperty } from '@nestjs/swagger';

export class AnswerResponseCheckbox {
    @ApiProperty()
    value: string;

    @ApiProperty()
    isCorrect: boolean;

    @ApiProperty()
    count: number;

    @ApiProperty()
    percentage: number;

    constructor(data: Partial<AnswerResponseCheckbox>) {
        Object.assign(this, data);
    }
}
