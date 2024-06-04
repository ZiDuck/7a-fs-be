import { CreateGroupQuestionFormInput, CreateSingleQuestionFormInput } from '../../modules/form-questions/dto/create-form-question.input';
import { CreateGroupQuestionSubmitTemp, CreateSingleQuestionSubmitTemp } from '../../modules/form-submits/dto/create-form-submit.dto';
import { GroupQuestionSubmitTemp, SingleQuestionSubmitTemp } from '../../modules/form-submits/dto/form-submit.dto';
import {
    AnswerSummaryCheckbox,
    AnswerSummaryFileUpload,
    AnswerSummaryFormGroup,
    AnswerSummaryText,
} from '../../modules/form-submits/dto/question-response.dto';
import {
    UpdateGroupQuestionSubmitTemp,
    UpdateGuestSelectSummary,
    UpdateGuestTextSummary,
    UpdateSingleQuestionSubmitTemp,
} from '../../modules/form-submits/dto/update-form-submit.dto';
import { AnswerResponseCheckbox } from '../../modules/form-summary/dto/answer-response-checkbox.dto';
import { AnswerResponseFileUpload } from '../../modules/form-summary/dto/answer-response-file-upload.dto';
import { RowResponse } from '../../modules/form-summary/dto/row-response.dto';

const extraModels = [
    AnswerResponseCheckbox,
    AnswerResponseFileUpload,
    RowResponse,
    AnswerSummaryText,
    AnswerSummaryCheckbox,
    AnswerSummaryFileUpload,
    AnswerSummaryFormGroup,
    CreateSingleQuestionSubmitTemp,
    CreateGroupQuestionSubmitTemp,
    SingleQuestionSubmitTemp,
    GroupQuestionSubmitTemp,
    UpdateSingleQuestionSubmitTemp,
    UpdateGroupQuestionSubmitTemp,
    UpdateGuestSelectSummary,
    UpdateGuestTextSummary,
    CreateSingleQuestionFormInput,
    CreateGroupQuestionFormInput,
];

export default extraModels;
