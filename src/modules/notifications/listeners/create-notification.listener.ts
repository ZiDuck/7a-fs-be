import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateNotificationEvent } from '../events/create-notification.event';
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
}
