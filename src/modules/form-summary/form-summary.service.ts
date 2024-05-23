import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { roundNumber } from '../../cores/utils/round.util';
import { FormQuestion } from '../form-questions/entities/form-question.entity';
import {
    AttributeType,
    GROUP_QUESTION_TYPES,
    ONE_SELECTION_QUESTION_TYPES,
    SELECTION_QUESTION_TYPES,
    SINGLE_QUESTION_TYPES,
    TEXT_QUESTION_TYPES,
} from '../form-questions/enums/attribute-type.enum';
import {
    FormQuestionSubmit,
    FormSubmitDto,
    GroupQuestionSubmitTemp,
    GuestAnswerFormGroup,
    SingleQuestionSubmitTemp,
} from '../form-submits/dto/form-submit.dto';
import { FormSubmitsService } from '../form-submits/form-submits.service';
import { Form } from '../forms/entities/form.entity';
import { GroupQuestionColumn } from '../group-questions/entities/group-question-column.entity';
import { GroupQuestionRow } from '../group-questions/entities/group-question-row.entity';
import { AnswerResponseCheckbox } from './dto/answer-response-checkbox.dto';
import { AnswerResponseFileUpload } from './dto/answer-response-file-upload.dto';
import { AnswerSummary } from './dto/answer-summary.dto';
import { ColResponse } from './dto/col-response.dto';
import { FormQuestionSummary } from './dto/form-question-summary.dto';
import { RowResponse } from './dto/row-response.dto';

@Injectable()
export class FormSummaryService {
    constructor(private formSubmitService: FormSubmitsService) {}

    async calculateSummary(form: Form, version: number = 0): Promise<any> {
        const formSubmits = await this.formSubmitService.findAllByForm(form, version);

        if (formSubmits.length === 0) {
            return formSubmits;
        }

        const standardQuestions = form.formQuestions;
        const formSubMetadata = formSubmits.map((submitted) => plainToInstance(FormSubmitDto, submitted.metadata));

        // Lọc ra các câu trả lời đã được submit
        const submittedQuestions = this.filterSubmittedQuestions(formSubMetadata);

        // Thống kê cho từng câu hỏi
        const questionSummaries = this.summarizeAllQuestions(standardQuestions, submittedQuestions);

        // Lọc ra các câu hỏi có percentage <= 50%
        const missedQuestions = this.getMissedQuestions(questionSummaries);

        const summary = {
            id: form.id,
            title: form.title,
            description: form.description,
            insights: {},
            missedQuestions,
            questionSummaries: questionSummaries.map((ques) => new FormQuestionSummary(ques)),
        };

        return summary;
    }

    filterSubmittedQuestions(formSubMetadata: FormSubmitDto[]) {
        return formSubMetadata
            .map((fsMeta) => fsMeta.formQuestions)
            .flat()
            .filter((q) => {
                if (q instanceof SingleQuestionSubmitTemp) {
                    if (SELECTION_QUESTION_TYPES.includes(q.attributeType)) return q.singleQuestion.guestAnswer.choiceIds.length > 0;
                    else if (TEXT_QUESTION_TYPES.includes(q.attributeType) || AttributeType.STAR === q.attributeType)
                        return q.singleQuestion.guestAnswer.textValue;
                    else if (AttributeType.FILE_UPLOAD === q.attributeType) return q.singleQuestion.guestAnswer.fileValues.length > 0;
                    else return q;
                } else if (q instanceof GroupQuestionSubmitTemp) {
                    return q.groupQuestion.guestAnswer.gridIds.length > 0;
                }
            });
    }

    getMissedQuestions(questionSummaries: FormQuestionSummary[]) {
        return questionSummaries
            .map((ques) => {
                if (SINGLE_QUESTION_TYPES.includes(ques.attributeType)) {
                    const percentage = roundNumber(ques.answerSummary.correctResponses / ques.answerSummary.totalResponses);

                    if (percentage < 0.5) {
                        return {
                            id: ques.id,
                            label: ques.label,
                            totalResponses: ques.answerSummary.totalResponses,
                            correctResponses: ques.answerSummary.correctResponses,
                        };
                    }
                } else if (GROUP_QUESTION_TYPES.includes(ques.attributeType)) {
                    return ques.answerSummary.answerResponses
                        .map((ans) => {
                            if (ans instanceof RowResponse) {
                                const percentage = roundNumber(ans.correctResponses / ans.totalResponses);

                                if (percentage < 0.5) {
                                    return {
                                        id: ques.id,
                                        label: `${ques.label} (${ans.rowValue})`,
                                        totalResponses: ans.totalResponses,
                                        correctResponses: ans.correctResponses,
                                    };
                                }
                            }
                        })
                        .filter((ques) => ques);
                }
            })
            .filter((ques) => ques)
            .flat();
    }

    summarizeAllQuestions(standardQuestions: FormQuestion[], submittedQuestions: FormQuestionSubmit[]) {
        return standardQuestions.map((stQues) => {
            const answerSummary: AnswerSummary = {
                answerResponses: [],
            };

            const subQues = submittedQuestions.filter((subQues) => subQues.id === stQues.id);

            // Tính tổng số câu trả lời đúng cho câu hỏi dạng single
            if (SINGLE_QUESTION_TYPES.includes(stQues.attributeType)) {
                const sgqCorrectResponses = subQues.reduce((acc, ques) => {
                    if (ques instanceof SingleQuestionSubmitTemp) {
                        const correctRes = this.calcCorrectResForSingleQues(ques);
                        return acc + correctRes;
                    }
                }, 0);

                answerSummary.totalResponses = subQues.length;
                answerSummary.correctResponses = sgqCorrectResponses;
            }

            //Thống kê cho từng câu hỏi để đưa lên Bar Chart
            if (TEXT_QUESTION_TYPES.includes(stQues.attributeType)) {
                answerSummary.answerResponses = this.summarizeForTextQuestion(stQues, subQues);
            } else if (SELECTION_QUESTION_TYPES.includes(stQues.attributeType)) {
                answerSummary.answerResponses = this.summarizeSelectionQuestion(stQues, subQues);
            } else if (AttributeType.FILE_UPLOAD === stQues.attributeType) {
                answerSummary.answerResponses = this.summarizeFileUploadQuestion(stQues, subQues);
            } else if (AttributeType.STAR === stQues.attributeType) {
                answerSummary.answerResponses = this.summarizeForTextQuestion(stQues, subQues);
            } else if (GROUP_QUESTION_TYPES.includes(stQues.attributeType)) {
                answerSummary.answerResponses = this.summarizeGroupQuestion(stQues, subQues);
            }

            const frmQuestionSummary = {
                id: stQues.id,
                label: stQues.label,
                description: stQues.description,
                order: stQues.order,
                attributeType: stQues.attributeType,
                formId: stQues.formId,
                answerSummary: new AnswerSummary(answerSummary),
            };

            return frmQuestionSummary as FormQuestionSummary;
        });
    }

    calcCorrectResForSingleQues(question: SingleQuestionSubmitTemp): number {
        if (SELECTION_QUESTION_TYPES.includes(question.attributeType)) {
            const correctChoiceIds = question.singleQuestion.singleQuestionValues.filter((value) => value.isCorrect).map((value) => value.id);

            if (ONE_SELECTION_QUESTION_TYPES.includes(question.attributeType)) {
                const guestChoiceId = question.singleQuestion.guestAnswer.choiceIds[0].id;

                if (correctChoiceIds.includes(guestChoiceId)) {
                    return 1;
                }
            } else if (AttributeType.CHECKBOX_BUTTON === question.attributeType) {
                const guestChoiceIds = question.singleQuestion.guestAnswer.choiceIds.map((choice) => choice.id);

                if (correctChoiceIds.length === guestChoiceIds.length && correctChoiceIds.every((id) => guestChoiceIds.includes(id))) {
                    return 1;
                }
            }
        } else if (TEXT_QUESTION_TYPES.includes(question.attributeType)) {
            const correctAnswer = question.singleQuestion.singleQuestionValues.filter(
                (value) => value.value === question.singleQuestion.guestAnswer.textValue,
            );

            if (correctAnswer.length > 0) {
                return 1;
            }
        } else {
            return 0;
        }

        return 0;
    }

    calcCorrectResForGroupQues(question: GroupQuestionSubmitTemp): number {
        if (question.attributeType === AttributeType.RADIO_GRID) {
            const correctAnswers = question.groupQuestion.answers.filter((ans) => ans.isCorrect);
            const rows = question.groupQuestion.rows;
            const guestChoices = question.groupQuestion.guestAnswer.gridIds;
            let totalScore = 0;

            rows.forEach((row) => {
                const correctRowAnswers = correctAnswers.filter((ans) => ans.rowId === row.id);
                const guestRowChoice = guestChoices.find((choice) => choice.rowId === row.id);

                if (guestRowChoice && correctRowAnswers.some((ans) => ans.id === guestRowChoice.id)) {
                    totalScore += row.score;
                }
            });

            return totalScore;
        } else if (question.attributeType === AttributeType.CHECKBOX_GRID) {
            const correctAnswers = question.groupQuestion.answers.filter((ans) => ans.isCorrect);
            const rows = question.groupQuestion.rows;
            const guestChoices = question.groupQuestion.guestAnswer.gridIds;
            let totalScore = 0;

            rows.forEach((row) => {
                const correctRowAnswers = correctAnswers.filter((ans) => ans.rowId === row.id);
                const guestRowChoices = guestChoices.filter((choice) => choice.rowId === row.id);

                if (
                    correctRowAnswers.length === guestRowChoices.length &&
                    correctRowAnswers.every((ans) => guestRowChoices.some((choice) => choice.id === ans.id))
                ) {
                    totalScore += row.score;
                }
            });

            return totalScore;
        }

        return 0;
    }

    calcCorrectResPerRow(stRow: GroupQuestionRow, guestChoices: GuestAnswerFormGroup[][], questionType: AttributeType) {
        const stAnswers = stRow.groupQuestionAnswers;
        const correctAnsIds = stAnswers.filter((ans) => ans.isCorrect).map((ans) => ans.id);

        if (AttributeType.RADIO_GRID === questionType) {
            const correctAnsPerRow = guestChoices.map((choices) => {
                const guestChoice = choices.find((choice) => choice.rowId === stRow.id);

                if (guestChoice && correctAnsIds.includes(guestChoice.id)) {
                    return 1;
                }

                return 0;
            });

            return correctAnsPerRow.reduce((acc, val) => acc + val, 0);
        } else if (AttributeType.CHECKBOX_GRID === questionType) {
            const correctAnsPerRow = guestChoices.map((choices) => {
                if (correctAnsIds.length === choices.length && correctAnsIds.every((ansId) => choices.some((choice) => choice.id === ansId))) {
                    return 1;
                }

                return 0;
            });

            return correctAnsPerRow.reduce((acc, val) => acc + val, 0);
        }
    }

    summarizeForTextQuestion(standQues: FormQuestion, subQues: SingleQuestionSubmitTemp[]): AnswerResponseCheckbox[] {
        const textValues = [...new Set(subQues.map((question) => question.singleQuestion.guestAnswer.textValue))];

        const textSummaries = textValues.map((textValue) => {
            const count = subQues.filter((question) => question.singleQuestion.guestAnswer.textValue === textValue).length;
            const correctValue = standQues.formSingleAttribute.singleQuestionValues.find((sQ) => sQ.value === textValue);
            return {
                value: textValue,
                count: count,
                isCorrect: correctValue ? correctValue.isCorrect : false,
                percentage: roundNumber((count / subQues.length) * 100),
            };
        });

        return textSummaries as AnswerResponseCheckbox[];
    }

    summarizeSelectionQuestion(stQues: FormQuestion, subQues: SingleQuestionSubmitTemp[]) {
        const choiceSummaries = stQues.formSingleAttribute.singleQuestionValues.reduce((acc, choice) => {
            if (choice.isOther) {
                const otherAnswers = subQues.filter((ques) => ques.singleQuestion.guestAnswer.choiceIds.some((c) => c.id === choice.id));

                const textValues = [...new Set(otherAnswers.map((answer) => answer.singleQuestion.guestAnswer.choiceIds.map((c) => c.value)))].flat();

                const otherResults = textValues.map((value) => {
                    const count = otherAnswers.filter((answer) => answer.singleQuestion.guestAnswer.choiceIds.some((c) => c.value === value)).length;
                    return {
                        value: value,
                        count: count,
                        isCorrect: choice.isCorrect,
                        percentage: roundNumber((count / subQues.length) * 100),
                    };
                });

                acc = [...acc, ...otherResults];
            } else {
                const count = subQues.filter((ques) => {
                    if (ONE_SELECTION_QUESTION_TYPES.includes(ques.attributeType)) {
                        return ques.singleQuestion.guestAnswer.choiceIds[0].id === choice.id;
                    } else if (AttributeType.CHECKBOX_BUTTON === ques.attributeType) {
                        return ques.singleQuestion.guestAnswer.choiceIds.some((c) => c.id === choice.id);
                    }
                }).length;

                acc = [
                    ...acc,
                    {
                        value: choice.value,
                        count: count,
                        isCorrect: choice.isCorrect,
                        percentage: roundNumber((count / subQues.length) * 100),
                    },
                ];
            }

            return acc;
        }, []);

        return choiceSummaries as AnswerResponseCheckbox[];
    }

    summarizeFileUploadQuestion(stQues: FormQuestion, subQues: SingleQuestionSubmitTemp[]): AnswerResponseFileUpload[] {
        return subQues
            .map((ques) => {
                const fileValues = ques.singleQuestion.guestAnswer.fileValues.map((file) => {
                    return {
                        filename: file.filename,
                        publicId: file.publicId,
                        secureUrl: file.secureUrl,
                        resourceType: file.resourceType,
                    };
                });
                return fileValues;
            })
            .flat() as AnswerResponseFileUpload[];
    }

    summarizeColResPerRow(stRow: GroupQuestionRow, stCol: GroupQuestionColumn, guestChoices: GuestAnswerFormGroup[][], questionType: AttributeType) {
        const stAnswer = stRow.groupQuestionAnswers.find((ans) => ans.columnId === stCol.id && ans.rowId === stRow.id);

        const count = guestChoices.reduce((acc, choices) => {
            const guestChoice = choices.find((choice) => stAnswer.id === choice.id);

            if (guestChoice) {
                return acc + 1;
            }

            return acc;
        }, 0);

        return {
            colValue: stCol.value,
            isCorrect: stAnswer.isCorrect,
            count,
            percentage: roundNumber((count / guestChoices.length) * 100),
        } as ColResponse;
    }

    summarizeGroupQuestion(stQues: FormQuestion, subQues: GroupQuestionSubmitTemp[]) {
        const stRows = stQues.formGroupAttribute.groupQuestionRows; // Lấy ra các dòng của câu hỏi tiêu chuẩn
        const stCols = stQues.formGroupAttribute.groupQuestionColumns; // Lấy ra các cột của câu hỏi tiêu chuẩn

        const subChoices = subQues.map((ques) => ques.groupQuestion.guestAnswer.gridIds);

        const answersPerRow = stRows.map((row) => {
            const answersPerRow = subChoices.map((subChoice) => subChoice.filter((grid) => grid.rowId === row.id));
            const correctAnsPerRow = this.calcCorrectResPerRow(row, answersPerRow, stQues.attributeType);
            const summarizeCols = stCols.map((col) => this.summarizeColResPerRow(row, col, answersPerRow, stQues.attributeType));

            return {
                rowValue: row.value,
                totalResponses: answersPerRow.length,
                correctResponses: correctAnsPerRow,
                colResponses: summarizeCols,
            } as RowResponse;
        });

        return answersPerRow;
    }
}
