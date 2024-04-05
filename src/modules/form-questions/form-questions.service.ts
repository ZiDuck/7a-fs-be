import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFormQuestionInput } from './dto/create-form-question.input';
import { UpdateFormQuestionDto } from './dto/update-form-question.dto';
import { FormQuestion } from './entities/form-question.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AttributeType, GROUP_QUESTION_TYPES, SINGLE_QUESTION_TYPES } from './enums/attribute-type.enum';
import { SingleQuestionValue } from '../single-questions/entities/single-question-value.entity';
import { SingleQuestionsService } from '../single-questions/single-questions.service';
import { GetFormQuestion } from './dto/get-form-question.dto';
import { GroupQuestionsService } from '../group-questions/group-questions.service';
import { GroupQuestionColumn } from '../group-questions/entities/group-question-column.entity';
import { GroupQuestionRow } from '../group-questions/entities/group-question-row.entity';
import { GroupQuestionAnswer } from '../group-questions/entities/group-question-answer.entity';
import { GetGroupQuestionValue } from '../group-questions/dto/get-group-question-value.dto';
import { GetSingleQuestionAttribute } from '../single-questions/dto/get-single-question-attribute.dto';
import { ImagesService } from '../images/images.service';
import { Form } from '../forms/entities/form.entity';

@Injectable()
export class FormQuestionsService {
    constructor(
        @InjectRepository(FormQuestion) private formQuestionRepository: Repository<FormQuestion>,
        @InjectRepository(Form) private formRepository: Repository<Form>,
        private singleQuestionsService: SingleQuestionsService,
        private groupQuestionsService: GroupQuestionsService,
        private imagesService: ImagesService,
    ) {}

    async create(data: CreateFormQuestionInput, formId: string) {
        this.validateQuestion(data, formId);

        const newQuestion = this.formQuestionRepository.create(data);

        if (SINGLE_QUESTION_TYPES.includes(data.attributeType)) {
            let attributeValues: DeepPartial<SingleQuestionValue>[] = [];

            const singleQuestionInput = data.singleQuestion;

            attributeValues = singleQuestionInput.singleQuestionValues.reduce((listQuestionValues, value) => {
                const attrValueInput = new SingleQuestionValue();
                attrValueInput.value = value.value;
                attrValueInput.imageId = value.imageId;
                attrValueInput.isCorrect = value.isCorrect;

                listQuestionValues.push(this.singleQuestionsService.getSingleQuestionValueRepository().create(attrValueInput));

                return listQuestionValues;
            }, [] as DeepPartial<SingleQuestionValue>[]);

            const attribute = this.singleQuestionsService.getSingleQuestionAttributeRepository().create({
                score: singleQuestionInput.score,
                isOther: singleQuestionInput.isOther,
                singleQuestionValues: attributeValues,
            });

            newQuestion.formSingleAttribute = attribute;
        } else if (GROUP_QUESTION_TYPES.includes(data.attributeType)) {
            const groupQuestionInput = data.groupQuestion;

            const groupQuestionRows = groupQuestionInput.rows.map((rowInput) => {
                const row = new GroupQuestionRow();
                row.score = rowInput.score;
                row.value = rowInput.value;
                row.order = rowInput.order;
                return this.groupQuestionsService.getGroupQuestionRowRepository().create(row);
            });

            const groupQuestionColumns = groupQuestionInput.columns.map((columnInput) => {
                const column = new GroupQuestionColumn();
                column.value = columnInput.value;
                column.order = columnInput.order;
                return this.groupQuestionsService.getGroupQuestionColumnRepository().create(column);
            });

            const attribute = this.groupQuestionsService.getGroupQuestionAttrRepository().create({
                groupQuestionRows: groupQuestionRows,
                groupQuestionColumns: groupQuestionColumns,
            });

            newQuestion.formGroupAttribute = attribute;
        } else if ([AttributeType.FILE_UPLOAD].includes(data.attributeType)) {
            throw new BadRequestException(`Type ${data.attributeType} chưa được hỗ trợ để tạo question`);
        } else {
            throw new BadRequestException(`Type ${data.attributeType} chưa được hỗ trợ để tạo question`);
        }

        const formQuestion = await this.formQuestionRepository.save(newQuestion);

        if (data.groupQuestion?.answers?.length > 0) {
            const groupQuestionAnswerData = data.groupQuestion.answers.map((answerInput) => {
                const answer = new GroupQuestionAnswer();
                const groupQuestionRow = formQuestion.formGroupAttribute.groupQuestionRows.find((row) => row.order === answerInput.rowOrder);
                const groupQuestionColumn = formQuestion.formGroupAttribute.groupQuestionColumns.find(
                    (column) => column.order === answerInput.columnOrder,
                );
                answer.groupQuestionRow = groupQuestionRow;
                answer.groupQuestionColumn = groupQuestionColumn;
                answer.isCorrect = answerInput.isCorrect;
                return this.groupQuestionsService.getGroupQuestionAnswerRepository().create(answer);
            });

            await this.groupQuestionsService.getGroupQuestionAnswerRepository().save(groupQuestionAnswerData);
        }

        return formQuestion;
    }

    // @Transactional()
    async createMany(data: CreateFormQuestionInput[], formId: string) {
        const results = await Promise.all(data.map((question) => this.create(question, formId)));

        return results ? true : false;
    }

    private validateQuestion(data: CreateFormQuestionInput, formId: string) {
        if (data.formId !== formId) throw new BadRequestException(`FormId của câu hỏi có index = ${data.order} không khớp với formId của Form`);
        // TODO: Thêm kiểm tra điều kiện cho order
        // TODO: Thêm kiểm tra điều kiện cho các type select, ít nhất một phần tử
    }

    findAll() {
        return `This action returns all formQuestions`;
    }

    async findAllByFormId(formId: string): Promise<GetFormQuestion[]> {
        const result = await this.formQuestionRepository.find({ where: { formId } });

        return await Promise.all(result.map((question) => this.customizeResult(question)));
    }

    async findOne(id: string): Promise<GetFormQuestion> {
        const result = await this.formQuestionRepository.findOne({ where: { id } });

        if (!result) throw new BadRequestException(`Không tồn tại câu hỏi với id ${id}`);

        return this.customizeResult(result);
    }

    async customizeResult(question: FormQuestion): Promise<GetFormQuestion> {
        const result = new GetFormQuestion();

        result.id = question.id;
        result.label = question.label;
        result.description = question.description;
        result.require = question.require;
        result.order = question.order;
        result.image = question.imageId ? await this.imagesService.checkImageHook(question.imageId) : null;
        result.attributeType = question.attributeType;
        result.formId = question.formId;

        if ([AttributeType.CHECKBOX_GRID, AttributeType.RADIO_GRID].includes(question.attributeType)) {
            const grQuestionRow = question.formGroupAttribute?.groupQuestionRows;
            const grQuestionCol = question.formGroupAttribute?.groupQuestionColumns;

            const grQuestion = new GetGroupQuestionValue();
            grQuestion.rows = grQuestionRow.map((row) => {
                return {
                    id: row.id,
                    score: row.score,
                    value: row.value,
                    order: row.order,
                };
            });

            grQuestion.columns = grQuestionCol.map((col) => {
                return {
                    id: col.id,
                    value: col.value,
                    order: col.order,
                };
            });
            grQuestion.answers = grQuestionRow.flatMap((row) =>
                row.groupQuestionAnswers.map((answer) => {
                    const column = grQuestionCol.find((col) => col.id === answer.columnId);
                    return {
                        id: answer.id,
                        isCorrect: answer.isCorrect,
                        rowId: answer.rowId,
                        columnId: answer.columnId,
                        rowOrder: row.order,
                        columnOrder: column ? column.order : null,
                    };
                }),
            );

            result.groupQuestion = grQuestion;
        } else if (
            [
                AttributeType.TEXT_BOX,
                AttributeType.PARAGRAPH,
                AttributeType.RADIO_BUTTON,
                AttributeType.CHECKBOX_BUTTON,
                AttributeType.DROPDOWN,
            ].includes(question.attributeType)
        ) {
            const singleQuestion = new GetSingleQuestionAttribute();

            singleQuestion.id = question.formSingleAttribute.id;
            singleQuestion.score = question.formSingleAttribute.score;
            singleQuestion.isOther = question.formSingleAttribute.isOther;
            singleQuestion.singleQuestionValues = await Promise.all(
                question.formSingleAttribute.singleQuestionValues.map(async (value) => {
                    const result = {
                        id: value.id,
                        value: value.value,
                        image: question.imageId ? await this.imagesService.checkImageHook(value.imageId) : null,
                        isCorrect: value.isCorrect,
                    };
                    return result;
                }),
            );

            result.singleQuestion = singleQuestion;
        }

        return result;
    }

    update(id: string, data: UpdateFormQuestionDto) {
        return `This action updates a #${id} formQuestion`;
    }

    remove(id: number) {
        return `This action removes a #${id} formQuestion`;
    }
}
