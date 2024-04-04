import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetGroupQuestionAnswer {
    @ApiProperty()
    id: string;

    @ApiProperty()
    rowId: string;

    @ApiPropertyOptional()
    rowOrder?: number;

    @ApiProperty()
    columnId: string;

    @ApiPropertyOptional()
    columnOrder?: number;

    @ApiProperty({
        example: true,
    })
    isCorrect: boolean;
}
