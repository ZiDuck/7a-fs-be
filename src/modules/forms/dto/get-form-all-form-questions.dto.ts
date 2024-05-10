import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { GetFormQuestion } from '../../form-questions/dto/get-form-question.dto';
import { GetFormDto } from './get-form.dto';

@Expose()
export class GetFormAllFormQuestionsDto extends OmitType(GetFormDto, ['formQuestions']) {
    @ApiProperty()
    totalScore: number;

    @ApiProperty({
        type: [GetFormQuestion],
    })
    formQuestions: GetFormQuestion[];
}
