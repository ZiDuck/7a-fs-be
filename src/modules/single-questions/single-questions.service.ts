import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { CreateFormInput } from '../forms/dto/create-form.input';
import { SingleQuestionAttribute } from './entities/single-question-attribute.entity';
import { SingleQuestionValue } from './entities/single-question-value.entity';

@Injectable()
export class SingleQuestionsService {
    constructor(
        @InjectRepository(SingleQuestionAttribute) private singleQuestionAttributeRepository: Repository<SingleQuestionAttribute>,
        @InjectRepository(SingleQuestionValue) private singleQuestionValueRepository: Repository<SingleQuestionValue>,
    ) {}

    @Transactional()
    async create(data: CreateFormInput) {
        // const result = this.singleQuestionAttributeRepository.create(data);
        // return await this.singleQuestionAttributeRepository.save(result);
    }

    getSingleQuestionAttributeRepository() {
        return this.singleQuestionAttributeRepository;
    }

    getSingleQuestionValueRepository() {
        return this.singleQuestionValueRepository;
    }
}
