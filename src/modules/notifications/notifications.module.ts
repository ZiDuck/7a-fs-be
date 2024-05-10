import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { Notification } from './entities/notification.entity';
import { NotificationListener } from './listeners/create-notification.listener';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
    imports: [TypeOrmModule.forFeature([Notification]), forwardRef(() => UsersModule)],
    controllers: [NotificationsController],
    providers: [NotificationsService, NotificationListener],
    exports: [NotificationsService],
})
export class NotificationsModule {}
