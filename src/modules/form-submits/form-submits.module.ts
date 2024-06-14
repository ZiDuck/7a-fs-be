import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormSubmit } from './entities/form-submit.entity';
import { FormSubmitsController } from './form-submits.controller';
import { FormSubmitsService } from './form-submits.service';

@Module({
    imports: [TypeOrmModule.forFeature([FormSubmit])],
    controllers: [FormSubmitsController],
    providers: [FormSubmitsService],
    exports: [FormSubmitsService],
})
export class FormSubmitsModule {}
