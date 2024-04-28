import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { FormSubmitsService } from './form-submits.service';
import { UpdateFormSubmitDto } from './dto/update-form-submit.dto';
import { plainToInstance } from 'class-transformer';
import { GetFormSubmitInfo } from './dto/get-form-submit-info.dto';
import { FormViewDto } from '../forms/dto/view-form.dto';

@Controller('form-submits')
export class FormSubmitsController {
    constructor(private readonly formSubmitsService: FormSubmitsService) {}

    // @Post()
    // async create(@Body() data: CreateFormSubmitDto) {
    //     return this.formSubmitsService.create(data);
    // }

    // @Get()
    // findAll() {
    //     return this.formSubmitsService.findAll();
    // }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return plainToInstance(GetFormSubmitInfo, this.formSubmitsService.findOne(id));
    }

    @Get(':id/view-score')
    async findOneDetail(@Param('id') id: string) {
        const result = await this.formSubmitsService.findOneViewScore(id);

        if (result.canSeeCorrectAnswer) {
            return result;
        } else {
            return plainToInstance(FormViewDto, result);
        }
    }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateFormSubmitDto: UpdateFormSubmitDto) {
    //     return this.formSubmitsService.update(+id, updateFormSubmitDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.formSubmitsService.remove(+id);
    // }
}
