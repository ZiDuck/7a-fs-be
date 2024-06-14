import { ApiProperty } from '@nestjs/swagger';

import { AttributeType } from '../../form-questions/enums/attribute-type.enum';
import { AnswerSummary } from './answer-summary.dto';

export class FormQuestionSummary {
    @ApiProperty()
    id: string;

    @ApiProperty()
    label: string;

    @ApiProperty()
    description: string | null;

    @ApiProperty()
    order: number;

    @ApiProperty({
        enum: AttributeType,
        enumName: 'AttributeType',
    })
    attributeType: AttributeType;

    @ApiProperty()
    formId: string;

    @ApiProperty({
        type: AnswerSummary,
    })
    answerSummary: AnswerSummary;

    constructor(data: Partial<FormQuestionSummary>) {
        Object.assign(this, data);
        this.answerSummary = new AnswerSummary(data.answerSummary!);
    }
}
