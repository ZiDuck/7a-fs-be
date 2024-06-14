import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { CreateNotificationEvent } from '../events/create-notification.event';
import { RemoveFormEvent } from '../events/remove-form.event';
import { RemoveUserEvent } from '../events/remove-user.event';
import { NotificationsService } from '../notifications.service';

@Injectable()
export class NotificationListener {
    constructor(private notificationService: NotificationsService) {}

    @OnEvent('user.created')
    async handleUserCreatedEvent(events: CreateNotificationEvent[]): Promise<void> {
        await this.notificationService.create(events);
    }

    @OnEvent('system.backup')
    async handleBackupCreatedEvent(events: CreateNotificationEvent[]): Promise<void> {
        await this.notificationService.create(events);
    }

    @OnEvent('user.remove')
    async handleUserRemoveEvent(event: RemoveUserEvent): Promise<void> {
        await this.notificationService.removeNotificationByUserId(event);
    }

    @OnEvent('form.remove')
    async handleFormRemoveEvent(event: RemoveFormEvent): Promise<void> {
        await this.notificationService.removeNotificationByFormId(event);
    }
}
