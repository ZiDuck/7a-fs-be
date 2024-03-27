import { Module } from '@nestjs/common';
import { SingleQuestionsService } from './single-questions.service';
import { SingleQuestionsController } from './single-questions.controller';

@Module({
  controllers: [SingleQuestionsController],
  providers: [SingleQuestionsService],
})
export class SingleQuestionsModule {}
