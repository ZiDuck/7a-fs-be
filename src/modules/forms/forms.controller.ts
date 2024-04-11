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
import { GetFormDto } from './dto/get-form.dto';
import { ApiPaginatedResponse } from '../../cores/decorators/api-paginated-dto.decorator';
import { ApiException } from '../../cores/decorators/api-exception.decorator';
import { ApiOkResponseDto } from '../../cores/decorators/api-ok-dto.decorator';
import { GetFormAllFormQuestionsDto } from './dto/get-form-all-form-questions.dto';
import { UpdateFormStatusDto } from './dto/update-form-status.dto';
import { CreateFormQuestionOfFormInput } from './dto/create-form-questions-of-form.input';
import { UseRoleGuard } from '../../cores/decorators/use-role.decorator';
import { AdminRole, AdminUserRole } from '../../cores/decorators/role.decorator';
import { FormFilterQuery } from './dto/form-filter-query.dto';
import { UpdateFormQuestionOfFormInput } from './dto/update-form-questions-of-form.input';

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
    async findAll(@Query() query: FormFilterQuery) {
        const result = await this.formsService.findAll(query);

        result.items = plainToInstance(GetFormDto, result.items);

        return result;
    }

    @AdminUserRole()
    @ApiPaginatedResponse(GetFormDto)
    @Get('is-deleted')
    async findAllDeleted(@Query() query: FormFilterQuery) {
        const result = await this.formsService.findAllDeleted(query);

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

    @AdminUserRole()
    @Patch('form-questions')
    async updateQuestions(@Body() data: UpdateFormQuestionOfFormInput) {
        try {
            return await this.formsService.updateQuestions(data);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    @AdminRole()
    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body() data: UpdateFormStatusDto) {
        return this.formsService.updateStatus(id, data);
    }

    @AdminUserRole()
    @Patch(':id/info')
    async updateInformation(@Param('id') id: string, @Body() data: UpdateFormDto) {
        try {
            return await this.formsService.updateInformation(id, data);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    @AdminUserRole()
    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        try {
            return await this.formsService.remove(id);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    @AdminUserRole()
    @Patch(':id/restore')
    async restoreDeleted(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        try {
            await this.formsService.restore(id);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }
}
