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
import { CurrentUserContext } from '../../cores/providers/current-user-context.provider';
import { UsersService } from '../users/users.service';
import { RoleType } from '../../cores/constants';
import { CreateFormSubmitDto } from '../form-submits/dto/create-form-submit.dto';
import { FormSubmitsService } from '../form-submits/form-submits.service';
import { FormViewDto } from './dto/view-form.dto';
import { FormSubmitQuery } from './dto/form-submit-query.dto';
import { FormSubmit } from '../form-submits/entities/form-submit.entity';
import { GROUP_QUESTION_TYPES, SINGLE_QUESTION_TYPES } from '../form-questions/enums/attribute-type.enum';
import { Errors } from '../../common/errors';

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
        private usersService: UsersService,
        private formSubmitService: FormSubmitsService,
        private readonly currentUserContext: CurrentUserContext,
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

    async submitForm(data: CreateFormSubmitDto): Promise<FormSubmit> {
        const existedForm = await this.findFormQuestions(data.id);

        if (data.version !== existedForm.version) throw new BadRequestException(`Phiên bản form không hợp lệ. Vui lòng load lại trang!`);

        if (existedForm.status !== FormStatus.ACCEPTED) throw new BadRequestException(`Chỉ được submit form có trạng thái là ${FormStatus.ACCEPTED}`);

        const formSubmit = await this.formSubmitService.create(data, existedForm);

        return formSubmit;
    }

    async findAll(query: FormFilterQuery) {
        const builder = this.formRepository.createQueryBuilder('form').orderBy('form.createdDate', 'DESC');

        const currentUser = await this.usersService.findOne(this.currentUserContext.getUserId());

        if (currentUser.role.value === RoleType.USER) {
            builder.andWhere('form.createdBy = :createdBy', { createdBy: currentUser.id });
        }

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

    async getFormResult(query: FormFilterQuery, builder: SelectQueryBuilder<Form>) {
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
            order: {
                formQuestions: {
                    order: 'ASC',
                    formGroupAttribute: {
                        groupQuestionRows: {
                            order: 'ASC',
                        },
                        groupQuestionColumns: {
                            order: 'ASC',
                        },
                    },
                },
            },
            relations: defaultRelation,
        });

        if (!result) throw Errors.FormNotFoundErrorBusiness(id);

        return result;
    }

    async findOneDeleted(id: string): Promise<Form> {
        const result = await this.formRepository.findOne({ where: { id: id }, relations: defaultRelation, withDeleted: true });

        if (!result) throw Errors.FormNotFoundErrorBusiness(id);

        return result;
    }

    async findFormQuestions(id: string) {
        const existedForm = await this.findOne(id);

        const formQuestionsResult = plainToInstance(GetFormQuestion, await this.formQuestionService.findAllByForm(existedForm));

        const customizeForm = plainToInstance(GetFormAllFormQuestionsDto, {
            ...existedForm,
            formQuestions: formQuestionsResult,
            image: existedForm.imageId ? await this.imagesService.checkImageHook(existedForm.imageId) : null,
            totalScore: this.calcTotalScore(formQuestionsResult),
        });

        return customizeForm;
    }

    calcTotalScore(formQuestionsResult: GetFormQuestion[]) {
        return formQuestionsResult.reduce((acc, question) => {
            if (SINGLE_QUESTION_TYPES.includes(question.attributeType)) {
                return acc + question.singleQuestion.score;
            } else if (GROUP_QUESTION_TYPES.includes(question.attributeType)) {
                return acc + question.groupQuestion.totalScore;
            }
        }, 0);
    }

    async findSubmitForm(id: string, query: FormSubmitQuery) {
        const existedForm = await this.findOne(id);

        const version = query?.version ? query.version : existedForm.version;

        const formSubmits = await this.formSubmitService.findAllByForm(existedForm, version);

        return formSubmits;
    }

    async findFormQuestionsForViewFormPage(id: string) {
        const existedForm = await this.findOne(id);

        if (existedForm.status !== FormStatus.ACCEPTED) throw new BadRequestException(`Không thể xem form ở trạng thái ${existedForm.status}`);

        const formQuestionsResult = plainToInstance(GetFormQuestion, await this.formQuestionService.findAllByForm(existedForm));

        const customizeForm = plainToInstance(FormViewDto, {
            ...existedForm,
            formQuestions: formQuestionsResult,
            image: existedForm.imageId ? await this.imagesService.checkImageHook(existedForm.imageId) : null,
            totalScore: this.calcTotalScore(formQuestionsResult),
        });

        return customizeForm;
    }

    async findCurrentVersion(id: string) {
        const result = await this.formRepository.findOne({
            where: { id: id },
        });

        if (!result) throw Errors.FormNotFoundErrorBusiness(id);

        return { version: result.version };
    }

    async findAllVersions(id: string) {
        const result = await this.formAuditRepository
            .createQueryBuilder('formAudit')
            .select("formAudit.form ->> 'version'", 'version')
            .where(`formAudit.form ->> 'id' = :id`, { id })
            // .orderBy("formAudit.form ->> 'version'", 'ASC')
            .orderBy('formAudit.createdDate', 'ASC')
            .getRawMany();

        if (!result) throw Errors.FormNotFoundErrorBusiness(id);

        return result;
    }

    @Transactional()
    async updateQuestions(data: UpdateFormQuestionOfFormInput) {
        const existedForm = await this.findOne(data.id);

        if (existedForm.status !== FormStatus.PENDING && existedForm.status !== FormStatus.ACCEPTED)
            throw new BadRequestException(`Chỉ có thể cập nhật câu hỏi cho form ở trạng thái ${FormStatus.PENDING} hoặc ${FormStatus.ACCEPTED}`);

        if (existedForm.status === FormStatus.ACCEPTED) {
            if (data.status === FormStatus.PENDING) throw new BadRequestException(`Không thể cập nhật trạng thái form từ ACCEPTED sang PENDING!`);

            const currentUserId = this.currentUserContext.getUserId();

            const user = await this.usersService.findOne(currentUserId);

            if (user.role.value !== RoleType.ADMIN)
                throw new BadRequestException('Chỉ có admin mới có thể cập nhật câu hỏi cho form ở trạng thái ACCEPTED');

            // Save form information to form audit
            const formAuditInput = this.formAuditRepository.create({
                form: existedForm,
                isMaster: existedForm.version === 0 ? true : false,
            });

            await this.formAuditRepository.save(formAuditInput);

            // Update version of the form
            data.version = existedForm.version + 1;
        }

        if (existedForm.status === FormStatus.PENDING) {
            const currentUser = await this.usersService.findOne(this.currentUserContext.getUserId());

            if (currentUser.role.value === RoleType.USER && existedForm.createdBy !== currentUser.id)
                throw new BadRequestException('Chỉ có người tạo form hoặc admin mới có thể cập nhật form ở trạng thái PENDING');
        }

        await this.formRepository.update({ id: data.id }, omit(data, ['formQuestions', 'status']));

        // TODO: Check this update logic again
        // const currentFormQuestions = await this.formQuestionService.findAllByFormId(data.id);

        // // Check each current form question
        // for (const currentFormQuestion of currentFormQuestions) {
        //     // If the current form question does not exist in data.questions, delete it
        //     if (!data.formQuestions.some((question) => question?.id === currentFormQuestion.id)) {
        //         await this.formQuestionService.delete(currentFormQuestion.id);
        //     }
        // }

        // // Update or create new form questions
        // for (const question of data.formQuestions) {
        //     const formQuestion = this.formQuestionService.create(question);
        //     // await this.formQuestionRepository.save(formQuestion);
        // }

        await this.formQuestionService.deleteAllByFormId(data.id);

        return await this.formQuestionService.createMany(data.formQuestions, data.id);
    }

    async updateStatus(id: string, data: UpdateFormStatusDto) {
        const existedForm = await this.findOne(id);

        if (existedForm.status === FormStatus.CLOSED) throw new BadRequestException(`Không thể cập nhật trạng thái cho form đã đóng!`);

        if (existedForm.status === FormStatus.ACCEPTED) {
            if (data.status === FormStatus.PENDING) throw new BadRequestException(`Không thể chuyển trạng thái form từ ACCEPTED sang PENDING!`);
            if (data.status === FormStatus.REJECTED) throw new BadRequestException(`Không thể chuyển trạng thái form từ ACCEPTED sang REJECTED!`);
        }

        if (existedForm.status === FormStatus.PENDING) {
            if (data.status === FormStatus.CLOSED) throw new BadRequestException(`Không thể chuyển trạng thái form từ PENDING sang CLOSED!`);
        }

        if (existedForm.status === FormStatus.REJECTED) {
            if (data.status === FormStatus.CLOSED) throw new BadRequestException(`Không thể chuyển trạng thái form từ REJECTED sang CLOSED!`);
            if (data.status === FormStatus.ACCEPTED) throw new BadRequestException(`Không thể chuyển trạng thái form từ REJECTED sang ACCEPTED!`);
        }
        const result = await this.formRepository.update(id, data);

        return result.affected ? true : false;
    }

    async updateInformation(id: string, data: UpdateFormDto) {
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
