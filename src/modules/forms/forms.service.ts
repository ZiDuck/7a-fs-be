import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormDto } from './dto/update-form.dto';
import { Transactional } from 'typeorm-transactional';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from './entities/form.entity';
import { Repository } from 'typeorm';
import { paginate } from '../../cores/utils/paginate.util';
import { PageQueryDto } from '../../common/dtos/page-query.dto';

@Injectable()
export class FormsService {
    constructor(@InjectRepository(Form) private formRepository: Repository<Form>) {}

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
        const result = await this.formRepository.findOne({ where: { id: id }, relations: {} });

        if (!result) throw new BadRequestException(`Form with id ${id} is not exists!`);

        return result;
    }

    update(id: number, updateFormDto: UpdateFormDto) {
        return `This action updates a #${id} form`;
    }

    remove(id: number) {
        return `This action removes a #${id} form`;
    }
}
