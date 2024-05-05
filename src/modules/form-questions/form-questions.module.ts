import { Module } from '@nestjs/common';
import { FormQuestionsService } from './form-questions.service';
import { FormQuestionsController } from './form-questions.controller';
import { FormQuestion } from './entities/form-question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SingleQuestionsModule } from '../single-questions/single-questions.module';
import { GroupQuestionsModule } from '../group-questions/group-questions.module';
import { Form } from '../forms/entities/form.entity';
import { RawFilesModule } from '../raw-files/raw-files.module';

@Module({
    imports: [TypeOrmModule.forFeature([FormQuestion, Form]), SingleQuestionsModule, GroupQuestionsModule, RawFilesModule],
    controllers: [FormQuestionsController],
    providers: [FormQuestionsService],
    exports: [FormQuestionsService],
})
export class FormQuestionsModule {}
