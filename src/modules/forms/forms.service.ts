import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormDto } from './dto/update-form.dto';
import { Transactional } from 'typeorm-transactional';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from './entities/form.entity';
import { FindOptionsRelationByString, FindOptionsRelations, Repository, SelectQueryBuilder } from 'typeorm';
import { paginate } from '../../cores/utils/paginate.util';
import { FormQuestionsService } from '../form-questions/form-questions.service';
import { plainToInstance } from 'class-transformer';
import { GetFormQuestion } from '../form-questions/dto/get-form-question.dto';
import { GetFormAllFormQuestionsDto } from './dto/get-form-all-form-questions.dto';
import { ImagesService } from '../images/images.service';
import { GetFormDto } from './dto/get-form.dto';
import { FormTemplateDto } from '../form_templates/dto/form-template.dto';
import { FormTemplatesService } from '../form_templates/form_templates.service';
import { UpdateFormStatusDto } from './dto/update-form-status.dto';
import { CreateFormQuestionOfFormInput } from './dto/create-form-questions-of-form.input';
import { FormStatus } from './enums/form-status.enum';
import omit from 'lodash/omit';
import { FormFilterQuery } from './dto/form-filter-query.dto';
import { UpdateFormQuestionOfFormInput } from './dto/update-form-questions-of-form.input';
import { FormAudit } from './entities/form-audit.entity';

type DefaultRelationType = FindOptionsRelations<Form> | FindOptionsRelationByString;

const defaultRelation: DefaultRelationType = {
    formQuestions: {
        formSingleAttribute: true,
        formGroupAttribute: {
            groupQuestionRows: {
                groupQuestionAnswers: true,
            },
        },
    },
};

@Injectable()
export class FormsService {
    constructor(
        @InjectRepository(Form) private formRepository: Repository<Form>,
        @InjectRepository(FormAudit) private formAuditRepository: Repository<FormAudit>,
        private readonly formQuestionService: FormQuestionsService,
        private imagesService: ImagesService,
        private formTemplatesService: FormTemplatesService,
    ) {}

    @Transactional()
    async create(data: CreateFormInput) {
        const result = this.formRepository.create(data);

        return await this.formRepository.save(result);
    }

    @Transactional()
    async createFormQuestions(data: CreateFormQuestionOfFormInput) {
        if (data.status !== FormStatus.PENDING) throw new BadRequestException(`Chỉ có thể tạo câu hỏi cho form ở trạng thái ${FormStatus.PENDING}`);

        const existedForm = await this.findOne(data.id);

        if (existedForm.formQuestions.length > 0) throw new BadRequestException(`Form có id ${data.id} đã tồn tại câu hỏi!`);

        await this.formRepository.update({ id: data.id }, omit(data, ['formQuestions', 'formId']));

        return await this.formQuestionService.createMany(data.formQuestions, data.id);
    }

    @Transactional()
    async createTemplateForm(id: string) {
        const existForm = await this.findFormQuestions(id);

        const formTemplate = plainToInstance(FormTemplateDto, existForm);

        const result = await this.formTemplatesService.create({
            title: formTemplate.title,
            category: formTemplate.category,
            metadata: formTemplate,
        });
        return result ? true : false;
    }

    async findAll(query: FormFilterQuery) {
        const builder = this.formRepository.createQueryBuilder('form').orderBy('form.createdDate', 'DESC');

        return await this.getFormResult(query, builder);
    }

    async findAllDeleted(query: FormFilterQuery) {
        const builder = this.formRepository
            .createQueryBuilder('form')
            .withDeleted()
            .where('form.deletedDate is not null')
            .orderBy('form.deletedDate', 'DESC');

        return await this.getFormResult(query, builder);
    }

    private async getFormResult(query: FormFilterQuery, builder: SelectQueryBuilder<Form>) {
        // Add search query for title
        if (query.title) {
            const processedTitle = query.title.trim();
            builder.andWhere('form.title ILIKE :title', { title: `%${processedTitle}%` });
        }

        // Add order query for orderBy input
        if (query.orderBy) {
            builder.orderBy('form.' + query.orderBy, query.orderType);
        }

        const result = await paginate(builder, query);

        result.items = await Promise.all(
            result.items.map(async (item) => {
                const customizeForm = plainToInstance(GetFormDto, {
                    ...item,
                    image: item.imageId ? await this.imagesService.checkImageHook(item.imageId) : null,
                });

                return customizeForm;
            }),
        );
        return result;
    }

    async findOne(id: string) {
        const result = await this.formRepository.findOne({
            where: { id: id },
            relations: defaultRelation,
        });

        if (!result) throw new BadRequestException(`Form with id ${id} is not exists!`);

        return result;
    }

    async findOneDeleted(id: string): Promise<Form> {
        const result = await this.formRepository.findOne({ where: { id: id }, relations: defaultRelation, withDeleted: true });

        if (!result) throw new BadRequestException(`Form with id ${id} is not exists!`);

        return result;
    }

    async findFormQuestions(id: string) {
        const existedForm = await this.findOne(id);

        const customizeForm = plainToInstance(GetFormAllFormQuestionsDto, {
            ...existedForm,
            // image: existedForm.imageId ? await this.imagesService.checkImageHook(existedForm.imageId) : null,
            image: await this.imagesService.checkImageHook(existedForm.imageId),
        });

        customizeForm.formQuestions = plainToInstance(GetFormQuestion, await this.formQuestionService.findAllByFormId(existedForm.id));

        return customizeForm;
    }

    @Transactional()
    async updateQuestions(data: UpdateFormQuestionOfFormInput) {
        const existedForm = await this.findOne(data.id);

        if (existedForm.status !== FormStatus.PENDING && existedForm.status !== FormStatus.ACCEPTED)
            throw new BadRequestException(`Chỉ có thể cập nhật câu hỏi cho form ở trạng thái ${FormStatus.PENDING} hoặc ${FormStatus.ACCEPTED}`);

        if (existedForm.status === FormStatus.ACCEPTED) {
            // Save form information to form audit
            const formAuditInput = this.formAuditRepository.create({
                form: existedForm,
                isMaster: existedForm.version === 0 ? true : false,
            });

            await this.formAuditRepository.save(formAuditInput);

            // Update version of the form
            data.version = existedForm.version + 1;
        }

        await this.formQuestionService.deleteAllByFormId(data.id);

        await this.formRepository.update({ id: data.id }, omit(data, ['formQuestions', 'formId']));

        return await this.formQuestionService.createMany(data.formQuestions, data.id);
    }

    async updateStatus(id: string, data: UpdateFormStatusDto) {
        return await this.updateInformation(id, data);
    }

    async updateInformation(id: string, data: UpdateFormDto | UpdateFormStatusDto) {
        await this.findOne(id);

        const result = await this.formRepository.update(id, data);

        return result.affected ? true : false;
    }

    async remove(id: string) {
        const deleteForm = await this.findOne(id);

        const result = await this.formRepository.softRemove(deleteForm);

        if (!result) throw new InternalServerErrorException();

        return;
    }

    async restore(id: string): Promise<void> {
        const restoreUser = await this.findOneDeleted(id);

        const result = await this.formRepository.recover(restoreUser);

        if (!result) throw new InternalServerErrorException();

        return;
    }
}
