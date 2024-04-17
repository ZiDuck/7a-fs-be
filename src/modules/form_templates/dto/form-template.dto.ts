import { Exclude, Type } from 'class-transformer';
import { GetFormQuestion } from '../../form-questions/dto/get-form-question.dto';
import { GetSingleQuestionAttribute } from '../../single-questions/dto/get-single-question-attribute.dto';
import { GetSingleQuestionValue } from '../../single-questions/dto/get-single-question-value.dto';
import { GetSingleQuestionFileConfig } from '../../single-questions/dto/get-single-question-file-config.dto';
import { GetGroupQuestionRow } from '../../group-questions/dto/get-group-question-row.dto';
import { GetGroupQuestionColumn } from '../../group-questions/dto/get-group-question-column.dto';
import { GetGroupQuestionAnswer } from '../../group-questions/dto/get-group-question-answer.dto';
import { GetFormAllFormQuestionsDto } from '../../forms/dto/get-form-all-form-questions.dto';
import { GetGroupQuestionValue } from '../../group-questions/dto/get-group-question-value.dto';

export class SingleQuestionFileConfigTemplate extends GetSingleQuestionFileConfig {
    @Exclude()
    id: string;
}

export class SingleQuestionTemplate extends GetSingleQuestionAttribute {
    @Exclude()
    id: string;

    @Type(() => SingleQuestionValueTemplate)
    singleQuestionValues: SingleQuestionValueTemplate[];

    @Type(() => SingleQuestionFileConfigTemplate)
    fileConfig: SingleQuestionFileConfigTemplate | null;
}

class GroupQuestionTemplate extends GetGroupQuestionValue {
    @Type(() => GroupQuestionRowTemplate)
    rows: GroupQuestionRowTemplate[];

    @Type(() => GroupQuestionColumnTemplate)
    columns: GroupQuestionColumnTemplate[];

    @Type(() => GroupQuestionAnswerTemplate)
    answers: GroupQuestionAnswerTemplate[];
}

export class FormTemplateDto extends GetFormAllFormQuestionsDto {
    @Exclude()
    id: string;

    @Type(() => FormQuestionTemplate)
    formQuestions: FormQuestionTemplate[];
}

export class FormQuestionTemplate extends GetFormQuestion {
    @Exclude()
    id: string;

    @Type(() => SingleQuestionTemplate)
    singleQuestion?: SingleQuestionTemplate;

    @Type(() => GroupQuestionTemplate)
    groupQuestion?: GroupQuestionTemplate;
}

export class SingleQuestionValueTemplate extends GetSingleQuestionValue {
    @Exclude()
    id: string;
}

class GroupQuestionRowTemplate extends GetGroupQuestionRow {
    @Exclude()
    id: string;
}

class GroupQuestionColumnTemplate extends GetGroupQuestionColumn {
    @Exclude()
    id: string;
}

class GroupQuestionAnswerTemplate extends GetGroupQuestionAnswer {
    @Exclude()
    id: string;

    @Exclude()
    rowId: string;

    @Exclude()
    columnId: string;
}
