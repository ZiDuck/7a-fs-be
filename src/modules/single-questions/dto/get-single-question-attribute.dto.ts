import { ApiProperty } from '@nestjs/swagger';
import { GetSingleQuestionValue } from './get-single-question-value.dto';
import { Exclude, Type } from 'class-transformer';

export class GetSingleQuestionAttribute {
    @ApiProperty()
    id: string;

    @ApiProperty({ example: 1 })
    score: number;

    @ApiProperty({ example: false })
    isOther: boolean;

    @ApiProperty()
    questionId: string;

    @ApiProperty({
        type: [GetSingleQuestionValue],
    })
    @Type(() => GetSingleQuestionValue)
    singleQuestionValues: GetSingleQuestionValue[];

    @Exclude()
    createdDate: Date;

    @Exclude()
    updatedDate: Date;
}
