import { Controller, Get, Patch, Param, ParseUUIDPipe, HttpException, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { GetNotificationOutput } from './dto/get-notification.output';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { UseRoleGuard } from '../../cores/decorators/use-role.decorator';
import { AdminUserRole } from '../../cores/decorators/role.decorator';
import { Errors } from '../../common/errors';
import { PageQueryDto } from '../../common/dtos/page-query.dto';

@ApiTags('Notification')
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

    @Get('read')
    @AdminUserRole()
    @ApiOkResponse({
        description: 'Successfully received model list',
        type: GetNotificationOutput,
        isArray: true,
    })
    async findAllRead(@Query() query: PageQueryDto) {
        try {
            const result = await this.notificationsService.findAllRead(query);

            return result;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw Errors.InternalServerErrorBusiness(error.message);
        }
    }

    @Get('unread')
    @AdminUserRole()
    @ApiOkResponse({
        description: 'Successfully received model list',
        type: GetNotificationOutput,
        isArray: true,
    })
    async findAllUnread(@Query() query: PageQueryDto) {
        try {
            const result = await this.notificationsService.findAllUnread(query);

            return result;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw Errors.InternalServerErrorBusiness(error.message);
        }
    }

    @Patch('all/read')
    updateAllRead() {
        return this.notificationsService.updateAllRead();
    }

    @Patch(':id/read')
    update(@Param('id', ParseUUIDPipe) id: string) {
        return this.notificationsService.update(id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.notificationsService.findOne(id);
    }
}
