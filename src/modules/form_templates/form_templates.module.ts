import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormTemplate } from './entities/form-template.entity';
import { FormTemplatesController } from './form_templates.controller';
import { FormTemplatesService } from './form_templates.service';

@Module({
    imports: [TypeOrmModule.forFeature([FormTemplate])],
    controllers: [FormTemplatesController],
    providers: [FormTemplatesService],
    exports: [FormTemplatesService],
})
export class FormTemplatesModule {}
