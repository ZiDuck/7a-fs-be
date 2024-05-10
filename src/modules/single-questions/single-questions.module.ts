import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SingleQuestionAttribute } from './entities/single-question-attribute.entity';
import { SingleQuestionValue } from './entities/single-question-value.entity';
import { SingleQuestionsController } from './single-questions.controller';
import { SingleQuestionsService } from './single-questions.service';

@Module({
    imports: [TypeOrmModule.forFeature([SingleQuestionAttribute, SingleQuestionValue])],
    controllers: [SingleQuestionsController],
    providers: [SingleQuestionsService],
    exports: [SingleQuestionsService],
})
export class SingleQuestionsModule {}
