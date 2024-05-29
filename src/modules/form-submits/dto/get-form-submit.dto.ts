import { ApiProperty, OmitType } from '@nestjs/swagger';

import { FormSubmitDto, GroupQuestionSubmitTemp, SingleQuestionSubmitTemp } from './form-submit.dto';

export class GetFormSubmit extends FormSubmitDto {
    @ApiProperty()
    formSubmitId: string;

    @ApiProperty()
    correctPoint: number;

    constructor(partial: Partial<GetFormSubmit>) {
        super();
        Object.assign(this, partial);
    }
}

export class GetFormSubmitWithIndexSingle extends OmitType(GetFormSubmit, ['formQuestions', 'correctPoint']) {
    @ApiProperty()
    index: number;

    formQuestions: SingleQuestionSubmitTemp;
}
export class GetFormSubmitWithIndexGroup extends OmitType(GetFormSubmit, ['formQuestions', 'correctPoint']) {
    @ApiProperty()
    index: number;

    formQuestions: GroupQuestionSubmitTemp;
}

export class GetFormSubmitMap {
    @ApiProperty({ example: 'uuid' })
    id: string;

    title: string;

    index: number;
}
