import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormDto } from './dto/update-form.dto';
import { Transactional } from 'typeorm-transactional';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from './entities/form.entity';
import { Repository } from 'typeorm';
import { paginate } from '../../cores/utils/paginate.util';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { FormQuestionsService } from '../form-questions/form-questions.service';
import { plainToInstance } from 'class-transformer';
import { GetFormQuestion } from '../form-questions/dto/get-form-question.dto';
import { GetFormAllFormQuestionsDto } from './dto/get-form-all-form-questions.dto';
import { ImagesService } from '../images/images.service';

@Injectable()
export class FormsService {
    constructor(
        @InjectRepository(Form) private formRepository: Repository<Form>,
        private readonly formQuestionService: FormQuestionsService,
        private imagesService: ImagesService,
    ) {}

    @Transactional()
    async create(data: CreateFormInput) {
        const result = this.formRepository.create(data);

        return await this.formRepository.save(result);
    }

    async findAll(query: PageQueryDto) {
        const builder = this.formRepository.createQueryBuilder('form');

        const result = await paginate(builder, query);

        return result;
    }

    async findOne(id: string) {
        const result = await this.formRepository.findOne({ where: { id: id } });

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

    update(id: number, updateFormDto: UpdateFormDto) {
        return `This action updates a #${id} form`;
    }

    remove(id: number) {
        return `This action removes a #${id} form`;
    }
}
