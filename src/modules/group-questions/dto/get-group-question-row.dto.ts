import { ApiProperty } from '@nestjs/swagger';

export class GetGroupQuestionRow {
    @ApiProperty()
    id: string;

    @ApiProperty({
        nullable: true,
        example: 1,
    })
    score: number | null;

    @ApiProperty()
    value: string;

    @ApiProperty()
    order: number;
}
