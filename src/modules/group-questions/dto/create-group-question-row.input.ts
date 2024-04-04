import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGroupQuestionRowInput {
    @ApiProperty({
        example: 1,
    })
    @IsNotEmpty()
    order: number;

    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    score: number;

    @ApiProperty({
        example: 'Value of the row',
    })
    @IsString()
    @IsNotEmpty()
    value: string;
}
