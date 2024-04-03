import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AttributeType } from '../enums/attribute-type.enum';
import { Type } from 'class-transformer';
import { ImageOutput } from '../../images/dto/image.output';
import { GetSingleQuestionValue } from '../../single-questions/dto/get-single-question-value.dto';
import { GetGroupQuestionValue } from '../../group-questions/dto/get-group-question-value.dto';
import { GetSingleQuestionAttribute } from '../../single-questions/dto/get-single-question-attribute.dto';

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

    // @ApiPropertyOptional({
    //     example: 1,
    // })
    // score?: number | null;

    // @ApiPropertyOptional()
    // isOther?: boolean;

    @ApiPropertyOptional({
        type: [GetSingleQuestionAttribute],
    })
    @Type(() => GetSingleQuestionAttribute)
    singleQuestion?: GetSingleQuestionAttribute | null;

    @ApiPropertyOptional({
        type: GetGroupQuestionValue,
    })
    @Type(() => GetGroupQuestionValue)
    groupQuestion?: GetGroupQuestionValue | null;
}
