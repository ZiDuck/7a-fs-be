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
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormDto } from './dto/update-form.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
import { CreateFormSubmitDto } from '../form-submits/dto/create-form-submit.dto';
import { FormSubmitQuery } from './dto/form-submit-query.dto';
import { GetFormSubmit } from '../form-submits/dto/get-form-submit.dto';
import { GetVersion } from './dto/get-version.dto';
import { FormViewDto } from './dto/view-form.dto';

@ApiTags('forms')
@Controller('forms')
export class FormsController {
    constructor(private readonly formsService: FormsService) {}

    @UseRoleGuard()
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

    @UseRoleGuard()
    @AdminUserRole()
    @UsePipes(new ValidationPipe({ transform: true }))
    @Post('form-questions')
    async createFormQuestions(@Body() data: CreateFormQuestionOfFormInput) {
        try {
            return await this.formsService.createFormQuestions(data);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    @Post('submit')
    @UsePipes(new ValidationPipe({ transform: true }))
    async submitForm(@Body() data: CreateFormSubmitDto) {
        return plainToInstance(GetFormSubmit, await this.formsService.submitForm(data));
    }

    @UseRoleGuard()
    @AdminUserRole()
    @Post(':id/templates')
    async createTemplateForm(@Param('id', ParseUUIDPipe) id: string) {
        return await this.formsService.createTemplateForm(id);
    }

    @UseRoleGuard()
    @AdminUserRole()
    @ApiPaginatedResponse(GetFormDto)
    @Get()
    async findAll(@Query() query: FormFilterQuery) {
        const result = await this.formsService.findAll(query);

        result.items = plainToInstance(GetFormDto, result.items);

        return result;
    }

    @UseRoleGuard()
    @AdminUserRole()
    @ApiPaginatedResponse(GetFormDto)
    @Get('is-deleted')
    async findAllDeleted(@Query() query: FormFilterQuery) {
        const result = await this.formsService.findAllDeleted(query);

        result.items = plainToInstance(GetFormDto, result.items);

        return result;
    }

    @ApiOkResponseDto(FormViewDto)
    @ApiException(() => BadRequestException, { description: 'The ${id} is not exists!' })
    @Get(':id/form-questions/view-form')
    async findFormQuestionsForViewFormPage(@Param('id', ParseUUIDPipe) id: string) {
        return await this.formsService.findFormQuestionsForViewFormPage(id);
    }

    @UseRoleGuard()
    @AdminUserRole()
    @ApiOkResponseDto(GetFormAllFormQuestionsDto)
    @ApiException(() => BadRequestException, { description: 'The ${id} is not exists!' })
    @Get(':id/form-questions')
    async findFormQuestions(@Param('id', ParseUUIDPipe) id: string) {
        return await this.formsService.findFormQuestions(id);
    }

    @UseRoleGuard()
    @AdminUserRole()
    @ApiOkResponseDto(GetFormSubmit)
    @ApiException(() => BadRequestException, { description: 'The ${id} is not exists!' })
    @Get(':id/submit-forms')
    async findSubmitForm(@Param('id', ParseUUIDPipe) id: string, @Query() query: FormSubmitQuery) {
        return await this.formsService.findSubmitForm(id, query);
    }

    @ApiOkResponse({
        type: GetVersion,
    })
    @ApiException(() => BadRequestException, { description: 'The ${id} is not exists!' })
    @Get(':id/versions/current')
    async findCurrentVersion(@Param('id', ParseUUIDPipe) id: string) {
        return plainToInstance(GetVersion, await this.formsService.findCurrentVersion(id));
    }

    @UseRoleGuard()
    @AdminUserRole()
    @ApiOkResponse({
        type: [GetVersion],
    })
    @ApiException(() => BadRequestException, { description: 'The ${id} is not exists!' })
    @Get(':id/versions')
    async findAllVersions(@Param('id', ParseUUIDPipe) id: string) {
        // return plainToInstance(GetVersion, await this.formsService.findAllVersions(id));
        return await this.formsService.findAllVersions(id);
    }

    @UseRoleGuard()
    @AdminUserRole()
    @ApiOkResponseDto(GetFormDto)
    @ApiException(() => BadRequestException, { description: 'The ${id} is not exists!' })
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return plainToInstance(GetFormDto, await this.formsService.findOne(id));
    }

    @UseRoleGuard()
    @AdminUserRole()
    @UsePipes(new ValidationPipe({ transform: true }))
    @Patch('form-questions')
    async updateQuestions(@Body() data: UpdateFormQuestionOfFormInput) {
        try {
            return await this.formsService.updateQuestions(data);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    @UseRoleGuard()
    @AdminRole()
    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body() data: UpdateFormStatusDto) {
        return this.formsService.updateStatus(id, data);
    }

    @UseRoleGuard()
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

    @UseRoleGuard()
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

    @UseRoleGuard()
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
