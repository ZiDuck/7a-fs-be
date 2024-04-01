import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FormQuestionsService } from './form-questions.service';
import { CreateFormQuestionInput } from './dto/create-form-question.input';
import { UpdateFormQuestionDto } from './dto/update-form-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormQuestion } from './entities/form-question.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('form-questions')
@Controller('form-questions')
export class FormQuestionsController {
    constructor(
        private readonly formQuestionsService: FormQuestionsService,
        @InjectRepository(FormQuestion) private formQuestionRepository: Repository<FormQuestion>,
    ) {}

    @Post()
    create(@Body() createFormQuestionDto: CreateFormQuestionInput) {
        return this.formQuestionsService.create(createFormQuestionDto);
    }

    @Get()
    findAll() {
        return this.formQuestionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.formQuestionsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFormQuestionDto: UpdateFormQuestionDto) {
        return this.formQuestionsService.update(id, updateFormQuestionDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.formQuestionsService.remove(+id);
    }
}
