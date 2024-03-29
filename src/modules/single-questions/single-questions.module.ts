import { Module } from '@nestjs/common';
import { SingleQuestionsService } from './single-questions.service';
import { SingleQuestionsController } from './single-questions.controller';
import { SingleQuestionAttribute } from './entities/single-question-attribute.entity';
import { SingleQuestionValue } from './entities/single-question-value.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([SingleQuestionAttribute, SingleQuestionValue])],
    controllers: [SingleQuestionsController],
    providers: [SingleQuestionsService],
    exports: [SingleQuestionsService],
})
export class SingleQuestionsModule {}
