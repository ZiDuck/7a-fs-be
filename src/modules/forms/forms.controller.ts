import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    BadRequestException,
    ParseUUIDPipe,
    HttpException,
    InternalServerErrorException,
} from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormDto } from './dto/update-form.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { GetFormDto } from './dto/get-form.dto';
import { ApiPaginatedResponse } from '../../cores/decorators/api-paginated-dto.decorator';
import { ApiException } from '../../cores/decorators/api-exception.decorator';
import { ApiOkResponseDto } from '../../cores/decorators/api-ok-dto.decorator';
import { GetFormAllFormQuestionsDto } from './dto/get-form-all-form-questions.dto';
import { UpdateFormStatusDto } from './dto/update-form-status.dto';
import { CreateFormQuestionOfFormInput } from './dto/create-form-questions-of-form.input';
import { UseRoleGuard } from '../../cores/decorators/use-role.decorator';
import { AdminRole, AdminUserRole } from '../../cores/decorators/role.decorator';

@ApiTags('forms')
@ApiBearerAuth()
@UseRoleGuard()
@Controller('forms')
export class FormsController {
    constructor(private readonly formsService: FormsService) {}

    @AdminUserRole()
    @ApiOkResponseDto(GetFormDto)
    @Post()
    async create(@Body() data: CreateFormInput) {
        try {
            const result = await this.formsService.create(data);
            return plainToInstance(GetFormDto, result);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    @AdminUserRole()
    @Post('form-questions')
    async createFormQuestions(@Body() data: CreateFormQuestionOfFormInput) {
        try {
            return await this.formsService.createFormQuestions(data);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    @AdminUserRole()
    @Post(':id/templates')
    async createTemplateForm(@Param('id', ParseUUIDPipe) id: string) {
        return await this.formsService.createTemplateForm(id);
    }

    @AdminUserRole()
    @ApiPaginatedResponse(GetFormDto)
    @Get()
    async findAll(@Query() query: PageQueryDto) {
        const result = await this.formsService.findAll(query);

        result.items = plainToInstance(GetFormDto, result.items);

        return result;
    }

    @AdminUserRole()
    @ApiOkResponseDto(GetFormAllFormQuestionsDto)
    @ApiException(() => BadRequestException, { description: 'The ${id} is not exists!' })
    @Get(':id/form-questions')
    async findFormQuestions(@Param('id', ParseUUIDPipe) id: string) {
        return await this.formsService.findFormQuestions(id);
    }

    @AdminUserRole()
    @ApiOkResponseDto(GetFormDto)
    @ApiException(() => BadRequestException, { description: 'The ${id} is not exists!' })
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return plainToInstance(GetFormDto, await this.formsService.findOne(id));
    }

    @AdminRole()
    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body() data: UpdateFormStatusDto) {
        return this.formsService.updateStatus(id, data);
    }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() data: UpdateFormDto) {
    //     return this.formsService.update(id, data);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.formsService.remove(+id);
    // }
}
