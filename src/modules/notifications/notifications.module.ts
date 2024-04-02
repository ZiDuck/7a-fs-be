import { Module, forwardRef } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Notification } from './entities/notification.entity';
import { NotificationListener } from './listeners/create-notification.listener';

@Module({
    imports: [TypeOrmModule.forFeature([Notification]), forwardRef(() => UsersModule)],
    controllers: [NotificationsController],
    providers: [NotificationsService, NotificationListener],
    exports: [NotificationsService],
})
export class NotificationsModule {}
