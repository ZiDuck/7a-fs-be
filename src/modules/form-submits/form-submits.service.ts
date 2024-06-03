import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { PageDto } from '../../common/dtos/page.dto';
import { paginate } from '../../cores/utils/paginate.util';
import { GetFormQuestion } from '../form-questions/dto/get-form-question.dto';
import {
    AttributeType,
    GROUP_QUESTION_TYPES,
    ONE_SELECTION_QUESTION_TYPES,
    SELECTION_QUESTION_TYPES,
    SINGLE_QUESTION_TYPES,
    TEXT_QUESTION_TYPES,
} from '../form-questions/enums/attribute-type.enum';
import { FormSubmitPaginateQuery } from '../forms/dto/form-submit-paginate-query.dto';
import { GetFormAllFormQuestionsDto } from '../forms/dto/get-form-all-form-questions.dto';
import { Form } from '../forms/entities/form.entity';
import { FormStatus } from '../forms/enums/form-status.enum';
import { CreateFormSubmitDto, CreateGroupQuestionSubmitTemp, CreateSingleQuestionSubmitTemp } from './dto/create-form-submit.dto';
import {
    FormSubmitDto,
    GroupQuestionSubmitTemp,
    GuestGroupSummary,
    GuestSelectSummary,
    GuestTextSummary,
    SingleQuestionSubmitTemp,
} from './dto/form-submit.dto';
import { GetFormSubmit } from './dto/get-form-submit.dto';
import { UpdateFormSubmitDto, UpdateGroupQuestionSubmitTemp, UpdateSingleQuestionSubmitTemp } from './dto/update-form-submit.dto';
import { FormSubmit } from './entities/form-submit.entity';

@Injectable()
export class FormSubmitsService {
    constructor(@InjectRepository(FormSubmit) private formSubmitRepository: Repository<FormSubmit>) {}

    async create(data: CreateFormSubmitDto, form: GetFormAllFormQuestionsDto) {
        const customizeData = this.customizeFormSubmitInput(data, form);

        data.formQuestions = customizeData;

        const formSubmit = this.formSubmitRepository.create({
            metadata: data,
        });

        const result = await this.formSubmitRepository.save(formSubmit);

        return result;
    }

    private customizeFormSubmitInput(data: CreateFormSubmitDto, form: GetFormAllFormQuestionsDto) {
        this.validateFormSubmit(data);

        const customizeData = data.formQuestions.map((question) => {
            const existedQuestion = form.formQuestions.find((existedQuestion) => existedQuestion.id === question.id);

            if (question instanceof CreateSingleQuestionSubmitTemp) {
                if (SELECTION_QUESTION_TYPES.includes(question.attributeType)) {
                    question.singleQuestion.guestAnswer.choiceIds = question.singleQuestion.guestAnswer.choiceIds.map((choice) => {
                        return {
                            ...choice,
                            value: question.singleQuestion.singleQuestionValues.find((value) => value.id === choice.id).value,
                        };
                    });
                }

                return {
                    ...question,
                    singleQuestion: {
                        ...question.singleQuestion,
                        singleQuestionValues: existedQuestion.singleQuestion.singleQuestionValues,
                        guestAnswer: {
                            ...question.singleQuestion.guestAnswer,
                            summaries: this.summarizeSingleQuestion(existedQuestion, question),
                            guestScore: this.calculateScoreForSingleQuestion(existedQuestion, question),
                        },
                    },
                };
            } else if (question instanceof CreateGroupQuestionSubmitTemp) {
                return {
                    ...question,
                    groupQuestion: {
                        ...question.groupQuestion,
                        answers: existedQuestion.groupQuestion.answers,
                        guestAnswer: {
                            ...question.groupQuestion.guestAnswer,
                            summaries: this.summarizeGroupQuestion(existedQuestion, question),
                        },
                    },
                };
            }
        });
        return customizeData;
    }

    validateFormSubmit(data: CreateFormSubmitDto | UpdateFormSubmitDto) {
        if (data.status !== FormStatus.ACCEPTED) throw new BadRequestException(`Chỉ được submit form có trạng thái là ${FormStatus.ACCEPTED}`);

        if (data.formQuestions && data.formQuestions.length > 0) {
            data.formQuestions.forEach((formQuestion) => {
                if (formQuestion instanceof CreateSingleQuestionSubmitTemp || formQuestion instanceof UpdateSingleQuestionSubmitTemp) {
                    const guestAnswer = formQuestion.singleQuestion.guestAnswer;

                    if (!guestAnswer) throw new BadRequestException(`Câu hỏi ${formQuestion.id} không gửi đúng đinh dạng câu trả lời`);

                    // Kiểm tra nếu câu hỏi text mà có nhiều hơn 1 câu trả lời thì throw error
                    if (TEXT_QUESTION_TYPES.includes(formQuestion.attributeType)) {
                        if (formQuestion.require && !guestAnswer?.textValue) {
                            throw new BadRequestException(`Câu hỏi ${formQuestion.id} không được để trống vì đây là câu hỏi bắt buộc`);
                        }
                    } else if (SELECTION_QUESTION_TYPES.includes(formQuestion.attributeType)) {
                        // Kiểm tra nếu câu hỏi bắt buộc mà không có câu trả lời thì throw error
                        if (formQuestion.require && guestAnswer.choiceIds.length === 0) {
                            throw new BadRequestException(`Câu hỏi ${formQuestion.id} không được để trống vì đây là câu hỏi bắt buộc`);
                        }

                        // Kiểm tra nếu câu hỏi single selection mà có nhiều hơn 1 câu trả lời thì throw error
                        if (ONE_SELECTION_QUESTION_TYPES.includes(formQuestion.attributeType) && guestAnswer.choiceIds.length > 1) {
                            throw new BadRequestException(`Câu hỏi ${formQuestion.id} chỉ được chọn 1 câu trả lời`);
                        }

                        // Kiểm tra nếu câu hỏi single selection mà có câu trả lời không nằm trong values thì throw error
                        const listIdValues = formQuestion.singleQuestion.singleQuestionValues.map((value) => value.id);

                        guestAnswer.choiceIds.forEach((choice) => {
                            if (!listIdValues.includes(choice.id)) {
                                throw new BadRequestException(
                                    `Câu hỏi ${formQuestion.id} có đáp án không hợp lệ. ID trong câu trả lời phải trùng với ID trong values`,
                                );
                            }
                        });
                    } else if (formQuestion.attributeType === AttributeType.FILE_UPLOAD) {
                        if (!guestAnswer?.fileValues) throw new BadRequestException(`Câu hỏi ${formQuestion.id} không tồn tại câu trả lời`);

                        // Kiểm tra nếu câu hỏi file upload mà không có file nào gửi lên thì throw error
                        if (formQuestion.require && guestAnswer.fileValues.length === 0) {
                            throw new BadRequestException(`Câu hỏi ${formQuestion.id} không được để trống vì đây là câu hỏi bắt buộc`);
                        }

                        // Kiểm tra nếu câu hỏi file upload mà có số lượng file gửi lên nhiều hơn maxNumOfFiles thì throw error
                        if (
                            formQuestion.singleQuestion.fileConfig &&
                            guestAnswer.fileValues.length > formQuestion.singleQuestion.fileConfig.maxNumOfFiles
                        ) {
                            throw new BadRequestException(
                                `Câu hỏi ${formQuestion.id} chỉ được gửi lên tối đa ${formQuestion.singleQuestion.fileConfig.maxNumOfFiles} file`,
                            );
                        }

                        // Kiểm tra nếu câu hỏi file upload mà các file gửi lên có tổng kích thước vượt quá maxFileSizes thì throw error
                        if (
                            formQuestion.singleQuestion.fileConfig &&
                            guestAnswer.fileValues.reduce((acc, file) => acc + file.bytes, 0) > formQuestion.singleQuestion.fileConfig.maxFileSize
                        ) {
                            throw new BadRequestException(
                                `Câu hỏi ${formQuestion.id} chỉ được gửi lên tối đa ${formQuestion.singleQuestion.fileConfig.maxFileSize} bytes`,
                            );
                        }
                    }
                } else if (formQuestion instanceof CreateGroupQuestionSubmitTemp || formQuestion instanceof UpdateGroupQuestionSubmitTemp) {
                    if (!formQuestion.groupQuestion?.guestAnswer) throw new BadRequestException(`Câu hỏi ${formQuestion.id} không được để trống`);

                    // Get all unique rowIds from the guestAnswer
                    const rowIdsSet = [...new Set(formQuestion.groupQuestion.rows.map((row) => row.id))];
                    const colIdsSet = [...new Set(formQuestion.groupQuestion.columns.map((col) => col.id))];
                    const guestGridIds = formQuestion.groupQuestion.guestAnswer.gridIds;

                    if (formQuestion.require) {
                        if (guestGridIds.length === 0) {
                            throw new BadRequestException(`Câu hỏi ${formQuestion.id} không được để trống vì đây là câu hỏi bắt buộc`);
                        }

                        // Check each rowId
                        for (const rowId of rowIdsSet) {
                            // If there is no groupQuestionAnswer for this rowId, throw an error
                            if (!guestGridIds.some((answer) => answer.rowId === rowId)) {
                                throw new BadRequestException(`Câu hỏi ${formQuestion.id} không được để trống vì đây là câu hỏi bắt buộc`);
                            }
                        }
                    }

                    if (formQuestion.attributeType === AttributeType.RADIO_GRID) {
                        // Kiểm tra nếu câu hỏi group có mỗi row đều nhiều hơn 1 câu trả lời thì throw error
                        guestGridIds.forEach((answer) => {
                            // Đếm số lượng câu trả lời cho mỗi hàng, nếu có nhiều hơn 1 cột được chọn thì ném ra lỗi
                            const count = guestGridIds.filter((a) => a.rowId === answer.rowId).length;
                            if (count > 1) {
                                throw new BadRequestException(`Câu hỏi ${formQuestion.id} chỉ được chọn 1 câu trả lời cho mỗi hàng`);
                            }
                        });
                    }

                    // Kiểm tra nếu câu hỏi group có đáp án không hợp lệ thì throw error
                    guestGridIds.forEach((answer) => {
                        if (!rowIdsSet.includes(answer.rowId) || !colIdsSet.includes(answer.columnId)) {
                            throw new BadRequestException(
                                `Câu hỏi ${formQuestion.id} có đáp án không hợp lệ. Vui lòng kiểm tra lại columnId hoặc rowId`,
                            );
                        }
                    });
                }
            });
        }
    }

    summarizeSingleQuestion(stQuestion: GetFormQuestion, guestQuestion: CreateSingleQuestionSubmitTemp): GuestSelectSummary[] | GuestTextSummary {
        if (ONE_SELECTION_QUESTION_TYPES.includes(stQuestion.attributeType)) {
            const correctChoiceIds = stQuestion.singleQuestion.singleQuestionValues.filter((value) => value.isCorrect).map((value) => value.id);
            const guestChoiceIds = guestQuestion.singleQuestion.guestAnswer.choiceIds.map((choice) => choice.id);

            if (guestChoiceIds.length === 0) return [];

            const guestChoiceId = guestQuestion.singleQuestion.guestAnswer.choiceIds[0].id;

            if (correctChoiceIds.includes(guestChoiceId)) {
                return [
                    {
                        id: guestChoiceId,
                        isCorrect: true,
                    },
                ];
            } else {
                return [
                    {
                        id: guestChoiceId,
                        isCorrect: false,
                    },
                ];
            }
        } else if (AttributeType.CHECKBOX_BUTTON === stQuestion.attributeType) {
            const correctChoiceIds = stQuestion.singleQuestion.singleQuestionValues.filter((value) => value.isCorrect).map((value) => value.id);

            const guestChoiceIds = guestQuestion.singleQuestion.guestAnswer.choiceIds.map((choice) => choice.id);

            return guestChoiceIds.map((guestChoiceId) => {
                if (correctChoiceIds.includes(guestChoiceId)) {
                    return {
                        id: guestChoiceId,
                        isCorrect: true,
                    };
                } else {
                    return {
                        id: guestChoiceId,
                        isCorrect: false,
                    };
                }
            });
        } else if (TEXT_QUESTION_TYPES.includes(stQuestion.attributeType)) {
            const correctAnswer = stQuestion.singleQuestion.singleQuestionValues.filter(
                (value) => value.value === guestQuestion.singleQuestion.guestAnswer.textValue,
            );

            return correctAnswer.length > 0
                ? {
                      isCorrect: true,
                  }
                : {
                      isCorrect: false,
                  };
        }
    }

    summarizeGroupQuestion(stQuestion: GetFormQuestion, guestQuestion: CreateGroupQuestionSubmitTemp): GuestGroupSummary[] {
        if (guestQuestion.attributeType === AttributeType.RADIO_GRID) {
            const correctAnswers = stQuestion.groupQuestion.answers.filter((ans) => ans.isCorrect);
            const rows = stQuestion.groupQuestion.rows;
            const guestChoices = guestQuestion.groupQuestion.guestAnswer.gridIds;

            if (guestChoices.length === 0) return [];

            const summaries = rows.map((row) => {
                const correctRowAnswers = correctAnswers.filter((ans) => ans.rowId === row.id);
                const guestRowChoice = guestChoices.find((choice) => choice.rowId === row.id);
                let score = 0;

                if (guestRowChoice && correctRowAnswers.some((ans) => ans.id === guestRowChoice.id)) {
                    score += row.score;

                    return {
                        rowId: row.id,
                        score,
                        isCorrect: true,
                    };
                } else {
                    return {
                        rowId: row.id,
                        score,
                        isCorrect: false,
                    };
                }
            });

            return summaries;
        } else if (guestQuestion.attributeType === AttributeType.CHECKBOX_GRID) {
            const correctAnswers = stQuestion.groupQuestion.answers.filter((ans) => ans.isCorrect);
            const rows = stQuestion.groupQuestion.rows;
            const guestChoices = guestQuestion.groupQuestion.guestAnswer.gridIds;

            if (guestChoices.length === 0) return [];

            const summaries = rows.map((row) => {
                const correctRowAnswers = correctAnswers.filter((ans) => ans.rowId === row.id);
                const guestRowChoices = guestChoices.filter((choice) => choice.rowId === row.id);
                let score = 0;

                if (
                    correctRowAnswers.length === guestRowChoices.length &&
                    correctRowAnswers.every((ans) => guestRowChoices.some((choice) => choice.id === ans.id))
                ) {
                    score += row.score;

                    return {
                        rowId: row.id,
                        score,
                        isCorrect: true,
                    };
                } else {
                    return {
                        rowId: row.id,
                        score,
                        isCorrect: false,
                    };
                }
            });

            return summaries;
        }
    }

    async findAllByForm(form: Form, version: number) {
        return this.formSubmitRepository
            .createQueryBuilder('formSubmit')
            .where(`formSubmit.metadata ::jsonb @> \'{"id":"${form.id}", "version":${version}}\'`)
            .getMany();
    }

    async findAllByFormAndQuestionId(form: Form, version: number, questionId: string): Promise<GetFormSubmit[]> {
        const formSubmits = await this.formSubmitRepository
            .createQueryBuilder('formSubmit')
            .where(`formSubmit.metadata ::jsonb @> \'{"id":"${form.id}", "version":${version}}\'`)
            .andWhere(`formSubmit.metadata ::jsonb @> \'{"formQuestions": [{"id": "${questionId}"}]}\'`)
            .orderBy('formSubmit.createdDate', 'ASC')
            .getMany();

        return formSubmits.map((formSubmit) => {
            return new GetFormSubmit({
                ...formSubmit.metadata,
                formSubmitId: formSubmit.id,
            });
        });
    }

    async findAllPaginateByForm(form: Form, query: FormSubmitPaginateQuery) {
        const version = query?.version ? query.version : form.version;

        const builder = this.formSubmitRepository
            .createQueryBuilder('formSubmit')
            .where(`formSubmit.metadata ::jsonb @> \'{"id":"${form.id}", "version":${version}}\'`);

        const formSubmitPaginate = await paginate(builder, query);

        const formSubmits = formSubmitPaginate.items;

        const formSubmitsResult = formSubmits.map((formSubmit) => {
            return {
                ...formSubmit.metadata,
                formSubmitId: formSubmit.id,
                correctPoint: this.calcCorrectAnswer(formSubmit.metadata),
            };
        });

        const result: PageDto<GetFormSubmit> = new PageDto<GetFormSubmit>(
            formSubmitsResult,
            formSubmitPaginate.itemCount,
            formSubmitPaginate.pageCount,
            formSubmitPaginate.take,
        );

        return result;
    }

    async findOne(id: string) {
        const formSubmit = await this.formSubmitRepository.findOneBy({ id });

        if (!formSubmit) throw new BadRequestException(`Không tồn tại form submit có id ${id}`);

        const formResult = formSubmit.metadata;

        return {
            ...formResult,
            formSubmitId: formSubmit.id,
        };
    }

    async findOneViewScore(id: string) {
        const formSubmit = await this.formSubmitRepository.findOneBy({ id });

        if (!formSubmit) throw new BadRequestException(`Không tồn tại form submit có id ${id}`);

        const formResult = formSubmit.metadata;

        return {
            ...formResult,
            formSubmitId: formSubmit.id,
            formQuestions: formResult.formQuestions,
            correctPoint: this.calcCorrectAnswer(formResult),
        };
    }

    calculateScoreForSingleQuestion(stQuestion: GetFormQuestion, question: CreateSingleQuestionSubmitTemp) {
        const stQuestionValues = stQuestion.singleQuestion.singleQuestionValues;

        if (ONE_SELECTION_QUESTION_TYPES.includes(question.attributeType)) {
            const correctChoiceIds = stQuestionValues.filter((value) => value.isCorrect).map((value) => value.id);

            const guestChoiceId = question.singleQuestion.guestAnswer.choiceIds[0].id;

            if (correctChoiceIds.includes(guestChoiceId)) {
                return question.singleQuestion.score;
            }
        } else if (AttributeType.CHECKBOX_BUTTON === question.attributeType) {
            const correctChoiceIds = stQuestionValues.filter((value) => value.isCorrect).map((value) => value.id);

            const guestChoiceIds = question.singleQuestion.guestAnswer.choiceIds.map((choice) => choice.id);

            if (correctChoiceIds.length === guestChoiceIds.length && correctChoiceIds.every((id) => guestChoiceIds.includes(id))) {
                return question.singleQuestion.score;
            }
        } else if (TEXT_QUESTION_TYPES.includes(question.attributeType)) {
            const correctAnswer = stQuestionValues.filter((value) => value.value === question.singleQuestion.guestAnswer.textValue);

            if (correctAnswer.length > 0) {
                return question.singleQuestion.score;
            }
        } else {
            return question.singleQuestion.score;
        }

        return 0;
    }

    calcCorrectAnswer(formSubmit: FormSubmitDto) {
        const questions = formSubmit.formQuestions;

        return questions.reduce((acc, question) => {
            if (SINGLE_QUESTION_TYPES.includes(question.attributeType)) {
                const questionTrans = plainToInstance(SingleQuestionSubmitTemp, question);

                return acc + questionTrans.singleQuestion.guestAnswer.guestScore;
            } else if (GROUP_QUESTION_TYPES.includes(question.attributeType)) {
                const questionTrans = plainToInstance(GroupQuestionSubmitTemp, question);

                const score = questionTrans.groupQuestion.guestAnswer.summaries.reduce((acc, summary) => acc + summary.score, 0);

                return acc + score;
            }

            return acc;
        }, 0);
    }

    async countByForm(form: Form, version: number) {
        const formSubmits = await this.findAllByForm(form, version);

        return formSubmits.length;
    }

    async update(data: UpdateFormSubmitDto) {
        this.validateFormSubmit(data);

        const formSubmitData = this.formSubmitRepository.create({
            id: data.submitId,
            metadata: data,
        });

        const result = await this.formSubmitRepository.save(formSubmitData);

        return result;
    }

    async remove(id: string) {
        const formSubmit = await this.formSubmitRepository.findOneBy({ id });

        if (!formSubmit) throw new BadRequestException(`Không tồn tại form submit có id ${id}`);

        return this.formSubmitRepository.remove(formSubmit);
    }
}
