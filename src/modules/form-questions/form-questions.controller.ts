import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, HttpException, InternalServerErrorException } from '@nestjs/common';
import { FormQuestionsService } from './form-questions.service';
import { CreateFormQuestionInput } from './dto/create-form-question.input';
import { UpdateFormQuestionDto } from './dto/update-form-question.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetFormQuestion } from './dto/get-form-question.dto';
import { ApiOkResponseDto } from '../../cores/decorators/api-ok-dto.decorator';
import { ApiException } from '../../cores/decorators/api-exception.decorator';
import { plainToInstance } from 'class-transformer';
import { CreateFormQuestionsInput } from './dto/create-form-questions.input';

@ApiTags('form-questions')
@Controller('form-questions')
export class FormQuestionsController {
    constructor(private readonly formQuestionsService: FormQuestionsService) {}

    @Post()
    async create(@Body() createFormQuestionDto: CreateFormQuestionInput) {
        try {
            const result = await this.formQuestionsService.create(createFormQuestionDto);
            return plainToInstance(GetFormQuestion, result);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    @Post('all')
    async createMany(@Body() data: CreateFormQuestionsInput) {
        try {
            return await this.formQuestionsService.createMany(data);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    @Get()
    findAll() {
        return this.formQuestionsService.findAll();
    }

    @ApiOkResponseDto(GetFormQuestion)
    @ApiException(() => BadRequestException, { description: 'Không tồn tại câu hỏi với id ${id}' })
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<GetFormQuestion> {
        return await this.formQuestionsService.findOne(id);
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
