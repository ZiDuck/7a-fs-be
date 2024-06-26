import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiException } from '../../cores/decorators/api-exception.decorator';
import { ApiOkResponseDto } from '../../cores/decorators/api-ok-dto.decorator';
import { GetFormQuestion } from './dto/get-form-question.dto';
import { FormQuestionsService } from './form-questions.service';

@ApiTags('form-questions')
@Controller('form-questions')
export class FormQuestionsController {
    constructor(private readonly formQuestionsService: FormQuestionsService) {}

    // @Post()
    // async create(@Body() createFormQuestionDto: CreateFormQuestionInput) {
    //     try {
    //         const result = await this.formQuestionsService.create(createFormQuestionDto);
    //         return plainToInstance(GetFormQuestion, result);
    //     } catch (error) {
    //         if (error instanceof HttpException) throw error;
    //         throw new InternalServerErrorException(error.message);
    //     }
    // }

    // @Get()
    // findAll() {
    //     return this.formQuestionsService.findAll();
    // }

    @ApiOkResponseDto(GetFormQuestion)
    @ApiException(() => BadRequestException, { description: 'Không tồn tại câu hỏi với id ${id}' })
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<GetFormQuestion> {
        return await this.formQuestionsService.findOne(id);
    }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateFormQuestionDto: UpdateFormQuestionDto) {
    //     return this.formQuestionsService.update(id, updateFormQuestionDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.formQuestionsService.remove(+id);
    // }
}
