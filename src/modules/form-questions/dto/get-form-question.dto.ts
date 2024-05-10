import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { GetGroupQuestionValue } from '../../group-questions/dto/get-group-question-value.dto';
import { ImageOutput } from '../../images/dto/image.output';
import { GetSingleQuestionAttribute } from '../../single-questions/dto/get-single-question-attribute.dto';
import { AttributeType } from '../enums/attribute-type.enum';

export class GetFormQuestion {
    @ApiProperty()
    id: string;

    @ApiProperty()
    label: string;

    @ApiProperty({
        nullable: true,
        example: 'Description of the question',
    })
    description: string | null;

    @ApiProperty()
    require: boolean;

    @ApiProperty()
    order: number;

    @ApiProperty({
        type: ImageOutput,
        nullable: true,
    })
    image: ImageOutput | null;

    @ApiProperty({
        enum: AttributeType,
    })
    attributeType: AttributeType;

    @ApiProperty()
    formId: string;

    @ApiPropertyOptional({
        type: [GetSingleQuestionAttribute],
    })
    @Type(() => GetSingleQuestionAttribute)
    singleQuestion?: GetSingleQuestionAttribute;

    @ApiPropertyOptional({
        type: GetGroupQuestionValue,
    })
    @Type(() => GetGroupQuestionValue)
    groupQuestion?: GetGroupQuestionValue;
}
