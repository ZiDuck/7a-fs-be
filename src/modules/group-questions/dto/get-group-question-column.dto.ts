import { ApiProperty } from '@nestjs/swagger';

export class GetGroupQuestionColumn {
    @ApiProperty()
    id: string;

    @ApiProperty()
    value: string;

    @ApiProperty()
    order: number;
}
