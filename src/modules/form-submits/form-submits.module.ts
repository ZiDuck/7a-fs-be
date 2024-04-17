import { Module } from '@nestjs/common';
import { FormSubmitsService } from './form-submits.service';
import { FormSubmitsController } from './form-submits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormSubmit } from './entities/form-submit.entity';

@Module({
    imports: [TypeOrmModule.forFeature([FormSubmit])],
    controllers: [FormSubmitsController],
    providers: [FormSubmitsService],
    exports: [FormSubmitsService],
})
export class FormSubmitsModule {}
