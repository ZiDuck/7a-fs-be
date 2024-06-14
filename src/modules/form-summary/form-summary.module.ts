import { Module } from '@nestjs/common';

import { FormSubmitsModule } from '../form-submits/form-submits.module';
import { FormSummaryController } from './form-summary.controller';
import { FormSummaryService } from './form-summary.service';

@Module({
    imports: [FormSubmitsModule],
    controllers: [FormSummaryController],
    providers: [FormSummaryService],
    exports: [FormSummaryService],
})
export class FormSummaryModule {}
