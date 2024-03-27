import { Module } from '@nestjs/common';
import { GroupQuestionsService } from './group-questions.service';
import { GroupQuestionsController } from './group-questions.controller';

@Module({
  controllers: [GroupQuestionsController],
  providers: [GroupQuestionsService],
})
export class GroupQuestionsModule {}
