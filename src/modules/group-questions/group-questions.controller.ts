import { Controller } from '@nestjs/common';

import { GroupQuestionsService } from './group-questions.service';

@Controller('group-questions')
export class GroupQuestionsController {
    constructor(private readonly groupQuestionsService: GroupQuestionsService) {}
}
