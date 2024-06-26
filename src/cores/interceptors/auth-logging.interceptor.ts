import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClsService } from 'nestjs-cls';
import { catchError, Observable, tap } from 'rxjs';
import { Transactional } from 'typeorm-transactional';

import { CreateNotificationEvent } from '../../modules/notifications/events/create-notification.event';
import { UsersService } from '../../modules/users/users.service';
import { ActionType, AUTH_LOGGING_DATA, NotificationStatus, NotificationType, USER_AUDIT } from '../constants';

@Injectable()
export class AuthLoggingInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private readonly cls: ClsService,
        private readonly userService: UsersService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (context.getType() !== 'http') {
            return;
        }
        return next.handle().pipe(
            tap(async () => await this.handleSuccessLog(context)),
            catchError(async (err) => {
                throw err;
            }),
        );
    }

    getActionType(context: ExecutionContext): ActionType {
        return this.reflector.get<string>(AUTH_LOGGING_DATA, context.getHandler()) as ActionType;
    }

    @Transactional()
    async handleSuccessLog(context: ExecutionContext) {
        const actionType = this.getActionType(context);
        const args = context.switchToHttp();
        const req = args.getRequest();

        const userId = this.cls.get(USER_AUDIT);

        const users = await this.userService.findAllNotCurrUser(req.user.sub);

        if (actionType === ActionType.CREATE_USER) {
            // create notification event
            const eventData: CreateNotificationEvent[] = [];

            users.forEach((user) => {
                eventData.push({
                    sentByUserId: req.user.sub,
                    receivedByUserId: user.id,
                    status: NotificationStatus.SUCCESS,
                    type: NotificationType.CREATE_USER,
                    userId: userId,
                    formId: null,
                });
            });

            eventData.push({
                sentByUserId: req.user.sub,
                receivedByUserId: req.user.sub,
                status: NotificationStatus.SUCCESS,
                type: NotificationType.CREATE_USER,
                userId: userId,
                formId: null,
            });

            this.eventEmitter.emit('user.created', eventData);
        } else if (actionType === ActionType.UPDATE_USER) {
            // create notification event
            const eventData: CreateNotificationEvent[] = [];

            users.forEach((user) => {
                eventData.push({
                    sentByUserId: req.user.sub,
                    receivedByUserId: user.id,
                    status: NotificationStatus.SUCCESS,
                    type: NotificationType.UPDATE_USER,
                    userId: userId,
                    formId: null,
                });
            });

            eventData.push({
                sentByUserId: req.user.sub,
                receivedByUserId: req.user.sub,
                status: NotificationStatus.SUCCESS,
                type: NotificationType.UPDATE_USER,
                userId: userId,
                formId: null,
            });

            this.eventEmitter.emit('user.created', eventData);
        } else if (actionType === ActionType.DElETE_USER) {
            // create notification event
            const eventData: CreateNotificationEvent[] = [];

            users.forEach((user) => {
                eventData.push({
                    sentByUserId: req.user.sub,
                    receivedByUserId: user.id,
                    status: NotificationStatus.SUCCESS,
                    type: NotificationType.DElETE_USER,
                    userId: userId,
                    formId: null,
                });
            });

            eventData.push({
                sentByUserId: req.user.sub,
                receivedByUserId: req.user.sub,
                status: NotificationStatus.SUCCESS,
                type: NotificationType.DElETE_USER,
                userId: userId,
                formId: null,
            });

            this.eventEmitter.emit('user.created', eventData);
        } else if (actionType === ActionType.RESTORE_USER) {
            // create notification event
            const eventData: CreateNotificationEvent[] = [];

            users.forEach((user) => {
                eventData.push({
                    sentByUserId: req.user.sub,
                    receivedByUserId: user.id,
                    status: NotificationStatus.SUCCESS,
                    type: NotificationType.RESTORE_USER,
                    userId: userId,
                    formId: null,
                });
            });

            eventData.push({
                sentByUserId: req.user.sub,
                receivedByUserId: req.user.sub,
                status: NotificationStatus.SUCCESS,
                type: NotificationType.RESTORE_USER,
                userId: userId,
                formId: null,
            });

            this.eventEmitter.emit('user.created', eventData);
        }
    }
}
