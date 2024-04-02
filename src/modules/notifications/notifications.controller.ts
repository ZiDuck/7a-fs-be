import { Controller, Get, Patch, Param, Delete, ParseUUIDPipe, HttpException, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { GetNotificationOutput } from './dto/get-notification.output';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { UseRoleGuard } from '../../cores/decorators/use-role.decorator';
import { AdminUserRole } from '../../cores/decorators/role.decorator';
import { Errors } from '../../common/errors';
import { PageQueryDto } from '../../common/dtos/page-query.dto';

@ApiTags('Notification')
@ApiBearerAuth()
@UseRoleGuard()
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Get()
    @AdminUserRole()
    @ApiOkResponse({
        description: 'Successfully received model list',
        type: GetNotificationOutput,
        isArray: true,
    })
    async findAll(@Query() query: PageQueryDto) {
        try {
            const result = await this.notificationsService.findAll(query);

            return result;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw Errors.InternalServerErrorBusiness(error.message);
        }
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.notificationsService.findOne(id);
    }

    @Patch(':id/read')
    update(@Param('id', ParseUUIDPipe) id: string) {
        return this.notificationsService.update(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.notificationsService.remove(+id);
    }
}
