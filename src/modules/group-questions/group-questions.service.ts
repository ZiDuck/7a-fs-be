import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupQuestionAttribute } from './entities/group-question-attribute.entity';
import { GroupQuestionRow } from './entities/group-question-row.entity';
import { GroupQuestionColumn } from './entities/group-question-column.entity';
import { GroupQuestionAnswer } from './entities/group-question-answer.entity';

@Injectable()
export class GroupQuestionsService {
    constructor(
        @InjectRepository(GroupQuestionAttribute)
        private readonly groupQuestionAttrRepository: Repository<GroupQuestionAttribute>,
        @InjectRepository(GroupQuestionRow)
        private readonly groupQuestionRowRepository: Repository<GroupQuestionRow>,
        @InjectRepository(GroupQuestionColumn)
        private readonly groupQuestionColumnRepository: Repository<GroupQuestionColumn>,
        @InjectRepository(GroupQuestionAnswer)
        private readonly groupQuestionAnswerRepository: Repository<GroupQuestionAnswer>,
    ) {}

    getGroupQuestionAttrRepository() {
        return this.groupQuestionAttrRepository;
    }

    getGroupQuestionRowRepository() {
        return this.groupQuestionRowRepository;
    }

    getGroupQuestionColumnRepository() {
        return this.groupQuestionColumnRepository;
    }

    getGroupQuestionAnswerRepository() {
        return this.groupQuestionAnswerRepository;
    }
}
