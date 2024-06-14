import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupQuestionColumnInput {
    @ApiProperty({
        example: 1,
    })
    @IsNotEmpty()
    order: number;

    @ApiProperty({
        example: 'Value of the column',
    })
    @IsString()
    @IsNotEmpty()
    value: string;
}
