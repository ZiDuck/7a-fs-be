import { Module } from '@nestjs/common';
import { FormQuestionsService } from './form-questions.service';
import { FormQuestionsController } from './form-questions.controller';
import { FormQuestion } from './entities/form-question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SingleQuestionsModule } from '../single-questions/single-questions.module';
import { GroupQuestionsModule } from '../group-questions/group-questions.module';
import { ImagesModule } from '../images/images.module';
import { Form } from '../forms/entities/form.entity';

@Module({
    imports: [TypeOrmModule.forFeature([FormQuestion, Form]), SingleQuestionsModule, GroupQuestionsModule, ImagesModule],
    controllers: [FormQuestionsController],
    providers: [FormQuestionsService],
    exports: [FormQuestionsService],
})
export class FormQuestionsModule {}
