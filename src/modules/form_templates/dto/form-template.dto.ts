import { Exclude, Type } from 'class-transformer';
import { AttributeType } from '../../form-questions/enums/attribute-type.enum';
import { FormCategory } from '../../forms/enums/form-category.enum';
import { FormStatus } from '../../forms/enums/form-status.enum';
import { ImageOutput } from '../../images/dto/image.output';

export class SingleQuestionTemplate {
    @Exclude()
    id: string;

    score: number;

    isOther: boolean;

    questionId: string;

    @Type(() => SingleQuestionValueTemplate)
    singleQuestionValues: SingleQuestionValueTemplate[];
}

class GetGroupQuestionTemplate {
    @Type(() => GetGroupQuestionRowTemplate)
    rows: GetGroupQuestionRowTemplate[];

    @Type(() => GetGroupQuestionColumnTemplate)
    columns: GetGroupQuestionColumnTemplate[];

    @Type(() => GetGroupQuestionAnswerTemplate)
    answers: GetGroupQuestionAnswerTemplate[];
}

export class FormTemplateDto {
    @Exclude()
    id: string;

    title: string;

    description: string | null;

    startSurvey: Date;

    status: FormStatus;

    hasAnswer: boolean;

    category: FormCategory;

    image: ImageOutput | null;

    imageId: string;

    @Type(() => FormQuestionTemplate)
    formQuestions: FormQuestionTemplate[];
}

export class FormQuestionTemplate {
    @Exclude()
    id: string;

    label: string;

    description: string | null;

    require: boolean;

    order: number;

    image: ImageOutput | null;

    attributeType: AttributeType;

    @Exclude()
    formId: string;

    @Type(() => SingleQuestionTemplate)
    singleQuestion?: SingleQuestionTemplate;

    @Type(() => GetGroupQuestionTemplate)
    groupQuestion?: GetGroupQuestionTemplate;
}

export class SingleQuestionValueTemplate {
    @Exclude()
    id: string;

    value: string;

    @Type(() => ImageOutput)
    image: ImageOutput | null;

    isCorrect: boolean;
}

class GetGroupQuestionRowTemplate {
    @Exclude()
    id: string;

    score: number;

    value: string;

    order: number;
}

class GetGroupQuestionColumnTemplate {
    @Exclude()
    id: string;

    value: string;

    order: number;
}

class GetGroupQuestionAnswerTemplate {
    @Exclude()
    id: string;

    @Exclude()
    rowId: string;

    @Exclude()
    columnId: string;

    rowOrder: number;

    columnOrder: number;

    isCorrect: boolean;
}
