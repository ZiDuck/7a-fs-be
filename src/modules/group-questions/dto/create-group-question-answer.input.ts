import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateGroupQuestionAnswerInput {
    @ApiProperty({
        example: 0,
    })
    @IsNotEmpty()
    rowOrder: number;

    @ApiProperty({
        example: 0,
    })
    @IsNotEmpty()
    columnOrder: number;

    @ApiProperty({
        example: true,
    })
    @IsNotEmpty()
    isCorrect: boolean;
}
