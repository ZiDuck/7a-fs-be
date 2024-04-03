import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { Form } from './entities/form.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormQuestionsModule } from '../form-questions/form-questions.module';
import { ImagesModule } from '../images/images.module';

@Module({
    imports: [TypeOrmModule.forFeature([Form]), FormQuestionsModule, ImagesModule],
    controllers: [FormsController],
    providers: [FormsService],
    exports: [FormsService],
})
export class FormsModule {}
