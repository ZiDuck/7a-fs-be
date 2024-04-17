import { Controller, Get, Param, Query } from '@nestjs/common';
import { FormTemplatesService } from './form_templates.service';
import { ApiTags } from '@nestjs/swagger';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { plainToInstance } from 'class-transformer';
import { GetFormTemplate, GetFormTemplateDetail } from './dto/get-form-template.dto';
import { ApiPaginatedResponse } from '../../cores/decorators/api-paginated-dto.decorator';
import { UseRoleGuard } from '../../cores/decorators/use-role.decorator';
import { AdminUserRole } from '../../cores/decorators/role.decorator';

@ApiTags('form templates')
@UseRoleGuard()
@Controller('form-templates')
export class FormTemplatesController {
    constructor(private readonly formTemplatesService: FormTemplatesService) {}

    @AdminUserRole()
    @ApiPaginatedResponse(GetFormTemplate)
    @Get()
    async findAll(@Query() query: PageQueryDto) {
        const result = await this.formTemplatesService.findAll(query);

        result.items = plainToInstance(GetFormTemplate, result.items);

        return result;
    }

    @AdminUserRole()
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return plainToInstance(GetFormTemplateDetail, await this.formTemplatesService.findOne(id));
    }
}
