import { ApiProperty } from '@nestjs/swagger';
import { GetSingleQuestionValue } from './get-single-question-value.dto';
import { Exclude, Type } from 'class-transformer';
import { GetSingleQuestionFileConfig } from './get-single-question-file-config.dto';

export class GetSingleQuestionAttribute {
    @ApiProperty()
    id: string;

    @ApiProperty({ example: 1 })
    score: number;

    @ApiProperty()
    questionId: string;

    @ApiProperty({
        type: [GetSingleQuestionValue],
    })
    @Type(() => GetSingleQuestionValue)
    singleQuestionValues: GetSingleQuestionValue[];

    @ApiProperty({
        nullable: true,
        type: GetSingleQuestionFileConfig,
    })
    @Type(() => GetSingleQuestionFileConfig)
    fileConfig: GetSingleQuestionFileConfig | null;

    @Exclude()
    createdDate: Date;

    @Exclude()
    updatedDate: Date;
}
