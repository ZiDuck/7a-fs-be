import { ApiProperty } from '@nestjs/swagger';

import { GetFormQuestion } from '../../form-questions/dto/get-form-question.dto';

export class AnswerSummaryFormSubmit {
    @ApiProperty()
    id: string;

    @ApiProperty()
    index: number;

    constructor(data: Partial<AnswerSummaryFormSubmit>) {
        Object.assign(this, data);
    }
}

export class AnswerSummaryText {
    @ApiProperty()
    value: string;

    @ApiProperty()
    isCorrect: boolean;

    @ApiProperty()
    score: number;

    @ApiProperty({
        type: [AnswerSummaryFormSubmit],
    })
    formSubmits: AnswerSummaryFormSubmit[];

    constructor(data: Partial<AnswerSummaryText>) {
        Object.assign(this, data);
    }
}

export class AnswerSummaryGuestChoice {
    @ApiProperty()
    id: string;

    @ApiProperty()
    value: string;

    @ApiProperty()
    isCorrect: boolean;

    constructor(data: Partial<AnswerSummaryGuestChoice>) {
        Object.assign(this, data);
    }
}

export class AnswerSummaryCheckbox {
    @ApiProperty({
        type: [AnswerSummaryGuestChoice],
    })
    guestChoices: AnswerSummaryGuestChoice[];

    @ApiProperty({
        type: [AnswerSummaryFormSubmit],
    })
    formSubmits: AnswerSummaryFormSubmit[];

    @ApiProperty()
    score: number;

    constructor(data: Partial<AnswerSummaryCheckbox>) {
        Object.assign(this, data);
    }
}

export class AnswerSummaryFileUpload {
    fileInfo: any;

    @ApiProperty({
        type: [AnswerSummaryFormSubmit],
    })
    formSubmits: AnswerSummaryFormSubmit[];
}

export class GuestColumnChoice {
    @ApiProperty()
    columnId: string;

    @ApiProperty()
    value: string;

    @ApiProperty()
    isCorrect: boolean;

    @ApiProperty()
    columnOrder: number;

    constructor(data: Partial<GuestColumnChoice>) {
        Object.assign(this, data);
    }
}

export class AnswerSummaryColumn {
    @ApiProperty({
        type: [GuestColumnChoice],
    })
    guestColChoices: GuestColumnChoice[];

    @ApiProperty()
    score: number;

    @ApiProperty({
        type: [AnswerSummaryFormSubmit],
    })
    formSubmits: AnswerSummaryFormSubmit[];
}

export class AnswerSummaryFormGroup {
    @ApiProperty()
    rowId: string;

    @ApiProperty({
        type: [AnswerSummaryColumn],
    })
    colSummaries: AnswerSummaryColumn[];
}

export class QuestionResponse extends GetFormQuestion {
    @ApiProperty()
    answerSummary: (AnswerSummaryText | AnswerSummaryCheckbox | AnswerSummaryFileUpload | AnswerSummaryFormGroup)[];
}
