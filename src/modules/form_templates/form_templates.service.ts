import { BadRequestException, Injectable } from '@nestjs/common';
import { FormTemplate } from './entities/form-template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFormTemplateInput } from './dto/create-form-template.input';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { paginate } from '../../cores/utils/paginate.util';

@Injectable()
export class FormTemplatesService {
    constructor(@InjectRepository(FormTemplate) private formTemplateRepository: Repository<FormTemplate>) {}

    async create(data: CreateFormTemplateInput) {
        const result = this.formTemplateRepository.create(data);

        return await this.formTemplateRepository.save(result);
    }

    async findAll(query: PageQueryDto) {
        const builder = this.formTemplateRepository.createQueryBuilder('formTemplate');

        builder.orderBy('formTemplate.createdDate', 'DESC');

        const result = await paginate(builder, query);

        return result;
    }

    async findOne(id: string) {
        const result = await this.formTemplateRepository.findOneBy({ id });

        if (!result) throw new BadRequestException(`Form mẫu với id ${id} không tồn tại!`);

        return result;
    }
}
