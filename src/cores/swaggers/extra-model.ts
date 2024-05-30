import { CreateGroupQuestionSubmitTemp, CreateSingleQuestionSubmitTemp } from '../../modules/form-submits/dto/create-form-submit.dto';
import {
    AnswerSummaryCheckbox,
    AnswerSummaryFileUpload,
    AnswerSummaryFormGroup,
    AnswerSummaryText,
} from '../../modules/form-submits/dto/question-response.dto';
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
];

export default extraModels;
