import { Controller, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { FormViewDto } from '../forms/dto/view-form.dto';
import { GetFormSubmitInfo } from './dto/get-form-submit-info.dto';
import { FormSubmitsService } from './form-submits.service';

@ApiTags('form-submits')
@Controller('form-submits')
export class FormSubmitsController {
    constructor(private readonly formSubmitsService: FormSubmitsService) {}

    @Get(':id')
    findOne(@Param('id') id: string) {
        return plainToInstance(GetFormSubmitInfo, this.formSubmitsService.findOne(id));
    }

    @Get(':id/view-score')
    @UsePipes(new ValidationPipe({ transform: true }))
    async findOneDetail(@Param('id') id: string) {
        const result = await this.formSubmitsService.findOneViewScore(id);

        if (result.canSeeCorrectAnswer) {
            return result;
        } else {
            return plainToInstance(FormViewDto, result);
        }
    }

    // @Patch(':id')
    // updateQuestionScore(@Param('id') id: string, @Body() data: UpdateFormSubmitDto) {
    //     return this.formSubmitsService.updateQuestionScore(id, data);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.formSubmitsService.remove(+id);
    // }
}
