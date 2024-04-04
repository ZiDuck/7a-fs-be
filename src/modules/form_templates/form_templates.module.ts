import { Module } from '@nestjs/common';
import { FormTemplatesService } from './form_templates.service';
import { FormTemplatesController } from './form_templates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormTemplate } from './entities/form-template.entity';

@Module({
    imports: [TypeOrmModule.forFeature([FormTemplate])],
    controllers: [FormTemplatesController],
    providers: [FormTemplatesService],
    exports: [FormTemplatesService],
})
export class FormTemplatesModule {}
