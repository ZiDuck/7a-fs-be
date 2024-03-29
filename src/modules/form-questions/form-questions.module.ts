import { Module } from '@nestjs/common';
import { FormQuestionsService } from './form-questions.service';
import { FormQuestionsController } from './form-questions.controller';
import { FormQuestion } from './entities/form-question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormsModule } from '../forms/forms.module';
import { SingleQuestionsModule } from '../single-questions/single-questions.module';

@Module({
    imports: [TypeOrmModule.forFeature([FormQuestion]), FormsModule, SingleQuestionsModule],
    controllers: [FormQuestionsController],
    providers: [FormQuestionsService],
})
export class FormQuestionsModule {}
