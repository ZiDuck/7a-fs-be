import { Controller } from '@nestjs/common';

import { FormSummaryService } from './form-summary.service';

@Controller('form-summary')
export class FormSummaryController {
    constructor(private readonly formSummaryService: FormSummaryService) {}
}
