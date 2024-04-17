import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { Form } from './entities/form.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormQuestionsModule } from '../form-questions/form-questions.module';
import { ImagesModule } from '../images/images.module';
import { FormTemplatesModule } from '../form_templates/form_templates.module';
import { FormSubscriber } from './subcribers/form.subcriber';
import { FormAudit } from './entities/form-audit.entity';
import { FormSubmitsModule } from '../form-submits/form-submits.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Form, FormAudit]), FormQuestionsModule, ImagesModule, FormTemplatesModule, UsersModule, FormSubmitsModule],
    controllers: [FormsController],
    providers: [FormsService, FormSubscriber],
    exports: [FormsService],
})
export class FormsModule {}
