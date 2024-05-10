import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Form } from '../forms/entities/form.entity';
import { GroupQuestionsModule } from '../group-questions/group-questions.module';
import { RawFilesModule } from '../raw-files/raw-files.module';
import { SingleQuestionsModule } from '../single-questions/single-questions.module';
import { FormQuestion } from './entities/form-question.entity';
import { FormQuestionsController } from './form-questions.controller';
import { FormQuestionsService } from './form-questions.service';

@Module({
    imports: [TypeOrmModule.forFeature([FormQuestion, Form]), SingleQuestionsModule, GroupQuestionsModule, RawFilesModule],
    controllers: [FormQuestionsController],
    providers: [FormQuestionsService],
    exports: [FormQuestionsService],
})
export class FormQuestionsModule {}
