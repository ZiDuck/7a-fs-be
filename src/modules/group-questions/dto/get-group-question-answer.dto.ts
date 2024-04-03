import { ApiProperty } from '@nestjs/swagger';

export class GetGroupQuestionAnswer {
    @ApiProperty()
    id: string;

    @ApiProperty()
    rowId: string;

    @ApiProperty()
    columnId: string;

    @ApiProperty({
        nullable: true,
        example: true,
    })
    isCorrect: boolean | null;
}
