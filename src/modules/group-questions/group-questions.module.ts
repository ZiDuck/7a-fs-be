import { Module } from '@nestjs/common';
import { GroupQuestionsService } from './group-questions.service';
import { GroupQuestionsController } from './group-questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupQuestionAnswer } from './entities/group-question-answer.entity';
import { GroupQuestionAttribute } from './entities/group-question-attribute.entity';
import { GroupQuestionColumn } from './entities/group-question-column.entity';
import { GroupQuestionRow } from './entities/group-question-row.entity';

@Module({
    imports: [TypeOrmModule.forFeature([GroupQuestionAttribute, GroupQuestionRow, GroupQuestionColumn, GroupQuestionAnswer])],
    controllers: [GroupQuestionsController],
    providers: [GroupQuestionsService],
    exports: [GroupQuestionsService],
})
export class GroupQuestionsModule {}
