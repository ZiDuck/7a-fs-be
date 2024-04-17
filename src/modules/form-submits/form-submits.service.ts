import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFormSubmitDto, CreateGroupQuestionSubmitTemp, CreateSingleQuestionSubmitTemp } from './dto/create-form-submit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormSubmit } from './entities/form-submit.entity';
import { FormStatus } from '../forms/enums/form-status.enum';
import {
    AttributeType,
    ONE_SELECTION_QUESTION_TYPES,
    SELECTION_QUESTION_TYPES,
    TEXT_QUESTION_TYPES,
} from '../form-questions/enums/attribute-type.enum';
import { Form } from '../forms/entities/form.entity';
import { GetFormAllFormQuestionsDto } from '../forms/dto/get-form-all-form-questions.dto';

@Injectable()
export class FormSubmitsService {
    constructor(@InjectRepository(FormSubmit) private formSubmitRepository: Repository<FormSubmit>) {}

    async create(data: CreateFormSubmitDto, form: GetFormAllFormQuestionsDto) {
        this.validateFormSubmit(data);

        const customizeData = data.formQuestions.map((question) => {
            const existedQuestion = form.formQuestions.find((existedQuestion) => existedQuestion.id === question.id);

            if (question instanceof CreateSingleQuestionSubmitTemp) {
                return {
                    ...question,
                    singleQuestion: {
                        ...question.singleQuestion,
                        singleQuestionValues: existedQuestion.singleQuestion?.singleQuestionValues,
                    },
                };
            } else if (question instanceof CreateGroupQuestionSubmitTemp) {
                return {
                    ...question,
                    groupQuestion: {
                        ...question.groupQuestion,
                        answers: existedQuestion.groupQuestion.answers,
                    },
                };
            }
        });

        data.formQuestions = customizeData;

        const formSubmit = this.formSubmitRepository.create({
            metadata: data,
        });

        await this.formSubmitRepository.save(formSubmit);

        return true;
    }

    validateFormSubmit(data: CreateFormSubmitDto) {
        if (data.status !== FormStatus.ACCEPTED) throw new BadRequestException(`Chỉ được submit form có trạng thái là ${FormStatus.ACCEPTED}`);

        if (data.formQuestions && data.formQuestions.length > 0) {
            data.formQuestions.forEach((formQuestion) => {
                if (formQuestion instanceof CreateSingleQuestionSubmitTemp) {
                    const guestAnswer = formQuestion.singleQuestion.guestAnswer;

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
                    }
                } else if (formQuestion instanceof CreateGroupQuestionSubmitTemp) {
                    if (!formQuestion.groupQuestion?.guestAnswer) throw new BadRequestException(`Câu hỏi ${formQuestion.id} không được để trống`);

                    // Get all unique rowIds from the guestAnswer
                    const rowIdsSet = [...new Set(formQuestion.groupQuestion.rows.map((row) => row.id))];
                    const colIdsSet = [...new Set(formQuestion.groupQuestion.columns.map((col) => col.id))];

                    if (formQuestion.require) {
                        if (formQuestion.groupQuestion.guestAnswer.length === 0) {
                            throw new BadRequestException(`Câu hỏi ${formQuestion.id} không được để trống vì đây là câu hỏi bắt buộc`);
                        }

                        // Check each rowId
                        for (const rowId of rowIdsSet) {
                            // If there is no groupQuestionAnswer for this rowId, throw an error
                            if (!formQuestion.groupQuestion.guestAnswer.some((answer) => answer.rowId === rowId)) {
                                throw new BadRequestException(`Câu hỏi ${formQuestion.id} không được để trống vì đây là câu hỏi bắt buộc`);
                            }
                        }
                    }

                    if (formQuestion.attributeType === AttributeType.RADIO_GRID) {
                        // Kiểm tra nếu câu hỏi group có mỗi row đều nhiều hơn 1 câu trả lời thì throw error
                        formQuestion.groupQuestion.guestAnswer.forEach((answer) => {
                            // Đếm số lượng câu trả lời cho mỗi hàng, nếu có nhiều hơn 1 cột được chọn thì ném ra lỗi
                            const count = formQuestion.groupQuestion.guestAnswer.filter((a) => a.rowId === answer.rowId).length;
                            if (count > 1) {
                                throw new BadRequestException(`Câu hỏi ${formQuestion.id} chỉ được chọn 1 câu trả lời cho mỗi hàng`);
                            }
                        });
                    }

                    // Kiểm tra nếu câu hỏi group có đáp án không hợp lệ thì throw error
                    formQuestion.groupQuestion.guestAnswer.forEach((answer) => {
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

    async findAllByForm(form: Form, version: number) {
        return this.formSubmitRepository
            .createQueryBuilder('formSubmit')
            .where(`formSubmit.metadata ::jsonb @> \'{"id":"${form.id}", "version":${version}}\'`)
            .getMany();
    }

    findOne(id: number) {
        return `This action returns a #${id} formSubmit`;
    }
}
