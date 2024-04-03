import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';

export class CreateGroupQuestionRowInput {
    @ApiProperty({
        nullable: true,
        example: 1,
    })
    @IsNotEmpty()
    order: number;

    @ApiProperty({
        nullable: true,
        example: 1,
    })
    @ValidateIf((d) => d.score !== null)
    @IsNumber()
    @IsNotEmpty()
    score: number | null;

    @ApiProperty({
        example: 'Value of the row',
    })
    @IsString()
    @IsNotEmpty()
    value: string;
}
