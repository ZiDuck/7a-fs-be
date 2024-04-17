import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { FormSubmitsService } from './form-submits.service';
import { UpdateFormSubmitDto } from './dto/update-form-submit.dto';

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

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //     return this.formSubmitsService.findOne(+id);
    // }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateFormSubmitDto: UpdateFormSubmitDto) {
    //     return this.formSubmitsService.update(+id, updateFormSubmitDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.formSubmitsService.remove(+id);
    // }
}
