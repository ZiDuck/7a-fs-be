import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFormQuestionInput } from './dto/create-form-question.input';
import { UpdateFormQuestionDto } from './dto/update-form-question.dto';
import { FormQuestion } from './entities/form-question.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AttributeType } from './enums/attribute-type.enum';
import { SingleQuestionAttribute } from '../single-questions/entities/single-question-attribute.entity';
import { FormsService } from '../forms/forms.service';
import { SingleQuestionValue } from '../single-questions/entities/single-question-value.entity';
import { SingleQuestionsService } from '../single-questions/single-questions.service';
import { Form } from '../forms/entities/form.entity';

@Injectable()
export class FormQuestionsService {
    constructor(
        @InjectRepository(FormQuestion) private formQuestionRepository: Repository<FormQuestion>,
        private formService: FormsService,
        private singleQuestionsService: SingleQuestionsService,
    ) {}

    async create(data: CreateFormQuestionInput) {
        const form = await this.formService.findOne(data.formId);

        // TODO: Viết logic check order
        this.validateQuestion(form, data);

        const newQuestion = this.formQuestionRepository.create(data);

        if (
            [
                AttributeType.TEXT_BOX,
                AttributeType.PARAGRAPH,
                AttributeType.RADIO_BUTTON,
                AttributeType.CHECKBOX_BUTTON,
                AttributeType.DROPDOWN,
            ].includes(data.attributeType)
        ) {
            let attributeValues: DeepPartial<SingleQuestionValue>[] = [];

            const singleQuestionInput = data.formSingleAttribute;

            attributeValues = singleQuestionInput.singleQuestionValues.reduce((listQuestionValues, value) => {
                const attrValueInput = new SingleQuestionValue();
                attrValueInput.value = value.value;
                attrValueInput.imageId = value.imageId;

                listQuestionValues.push(this.singleQuestionsService.getSingleQuestionValueRepository().create(attrValueInput));

                return listQuestionValues;
            }, [] as DeepPartial<SingleQuestionValue>[]);

            const attribute = this.singleQuestionsService.getSingleQuestionAttributeRepository().create({
                score: singleQuestionInput.score,
                isOther: singleQuestionInput.isOther,
                singleQuestionValues: attributeValues,
            });

            newQuestion.formSingleAttribute = attribute;
        } else if ([AttributeType.CHECKBOX_GRID, AttributeType.RADIO_GRID].includes(data.attributeType)) {
        } else if ([AttributeType.FILE_UPLOAD].includes(data.attributeType)) {
        } else {
        }

        return await this.formQuestionRepository.save(newQuestion);
    }

    private validateQuestion(form: Form, data: CreateFormQuestionInput) {
        if (form.hasAnswer && data.formSingleAttribute.score === null) {
            throw new BadRequestException('Score is required for this question because the form is the Quiz Form!');
        }
    }

    findAll() {
        return `This action returns all formQuestions`;
    }

    async findOne(id: string) {
        const result = await this.formQuestionRepository.findOne({ where: { id } });

        if (!result) throw new UserNotExistException(id);

        return result;
    }

    update(id: string, updateFormQuestionDto: UpdateFormQuestionDto) {
        return `This action updates a #${id} formQuestion`;
    }

    remove(id: number) {
        return `This action removes a #${id} formQuestion`;
    }
}
