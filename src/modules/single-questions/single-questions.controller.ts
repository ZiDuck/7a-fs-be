import { Controller } from '@nestjs/common';
import { SingleQuestionsService } from './single-questions.service';

@Controller('single-questions')
export class SingleQuestionsController {
    constructor(private readonly singleQuestionsService: SingleQuestionsService) {}
}
