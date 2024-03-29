import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, ParseUUIDPipe } from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormDto } from './dto/update-form.dto';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { GetFormDto } from './dto/get-form.dto';
import { ApiPaginatedResponse } from '../../cores/decorators/api-paginated-dto.decorator';
import { ApiException } from '../../cores/decorators/api-exception.decorator';
import { ApiOkResponseDto } from '../../cores/decorators/api-ok-dto.decorator';

@ApiTags('forms')
@Controller('forms')
export class FormsController {
    constructor(private readonly formsService: FormsService) {}

    @Post()
    create(@Body() data: CreateFormInput) {
        return this.formsService.create(data);
    }

    @ApiPaginatedResponse(GetFormDto)
    @Get()
    async findAll(@Query() query: PageQueryDto) {
        const result = await this.formsService.findAll(query);

        result.items = plainToInstance(GetFormDto, result.items);

        return result;
    }

    @ApiOkResponseDto(GetFormDto)
    @ApiException(() => BadRequestException, { description: 'The ${id} is not exists!' })
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return plainToInstance(GetFormDto, await this.formsService.findOne(id));
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
        return this.formsService.update(+id, updateFormDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.formsService.remove(+id);
    }
}
