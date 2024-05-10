import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormTemplatesModule } from '../form_templates/form_templates.module';
import { FormQuestionsModule } from '../form-questions/form-questions.module';
import { FormSubmitsModule } from '../form-submits/form-submits.module';
import { RawFilesModule } from '../raw-files/raw-files.module';
import { UsersModule } from '../users/users.module';
import { Form } from './entities/form.entity';
import { FormAudit } from './entities/form-audit.entity';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
import { FormSubscriber } from './subcribers/form.subcriber';

@Module({
    imports: [TypeOrmModule.forFeature([Form, FormAudit]), FormQuestionsModule, RawFilesModule, FormTemplatesModule, UsersModule, FormSubmitsModule],
    controllers: [FormsController],
    providers: [FormsService, FormSubscriber],
    exports: [FormsService],
})
export class FormsModule {}
