import { Controller, Get, Param, Query } from '@nestjs/common';
import { FormTemplatesService } from './form_templates.service';
import { ApiTags } from '@nestjs/swagger';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { plainToInstance } from 'class-transformer';
import { GetFormTemplate } from './dto/get-form-template.dto';

@ApiTags('Form Templates')
@Controller('form-templates')
export class FormTemplatesController {
    constructor(private readonly formTemplatesService: FormTemplatesService) {}

    @Get()
    async findAll(@Query() query: PageQueryDto) {
        const result = await this.formTemplatesService.findAll(query);

        result.items = plainToInstance(GetFormTemplate, result.items);

        return result;
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return plainToInstance(GetFormTemplate, await this.formTemplatesService.findOne(id));
    }
}
