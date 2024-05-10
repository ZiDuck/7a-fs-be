import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { ApiPaginatedResponse } from '../../cores/decorators/api-paginated-dto.decorator';
import { AdminUserRole } from '../../cores/decorators/role.decorator';
import { UseRoleGuard } from '../../cores/decorators/use-role.decorator';
import { GetFormTemplate, GetFormTemplateDetail } from './dto/get-form-template.dto';
import { FormTemplatesService } from './form_templates.service';

@ApiTags('form templates')
@UseRoleGuard()
@Controller('form-templates')
export class FormTemplatesController {
    constructor(private readonly formTemplatesService: FormTemplatesService) {}

    @AdminUserRole()
    @ApiPaginatedResponse(GetFormTemplate)
    @Get()
    async findAll(@Query() query: PageQueryDto) {
        const results = await this.formTemplatesService.findAll(query);

        const customizeItems = results.items.map((item) => {
            return {
                ...item,
                image: item.metadata.image ? item.metadata.image : null,
            };
        });

        results.items = plainToInstance(GetFormTemplate, customizeItems);

        return results;
    }

    @AdminUserRole()
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return plainToInstance(GetFormTemplateDetail, await this.formTemplatesService.findOne(id));
    }
}
