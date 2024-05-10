import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClsService } from 'nestjs-cls';
import { Observable, catchError, tap } from 'rxjs';
import { Transactional } from 'typeorm-transactional';

import { FormStatus } from '../../modules/forms/enums/form-status.enum';
import { FormsService } from '../../modules/forms/forms.service';
import { CreateNotificationEvent } from '../../modules/notifications/events/create-notification.event';
import { UsersService } from '../../modules/users/users.service';
import { ActionType, FORM_AUDIT, FORM_LOGGING_DATA, NotificationStatus, NotificationType, RoleType } from '../constants';

@Injectable()
export class FormLoggingInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private readonly cls: ClsService,
        private readonly userService: UsersService,
        private readonly formService: FormsService,
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
        return this.reflector.get<string>(FORM_LOGGING_DATA, context.getHandler()) as ActionType;
    }

    @Transactional()
    async handleSuccessLog(context: ExecutionContext) {
        const actionType = this.getActionType(context);
        const args = context.switchToHttp();
        const req = args.getRequest();

        const formId = this.cls.get(FORM_AUDIT);

        const adminUsers = await this.userService.findAllAdminNotCurrUser(req.user.sub);

        if (actionType === ActionType.CREATE_FORM) {
            // create notification event
            const eventData: CreateNotificationEvent[] = [];

            adminUsers.forEach((user) => {
                eventData.push({
                    sentByUserId: req.user.sub,
                    receivedByUserId: user.id,
                    status: NotificationStatus.SUCCESS,
                    type: NotificationType.CREATE_FORM,
                    userId: null,
                    formId: formId,
                });
            });

            eventData.push({
                sentByUserId: req.user.sub,
                receivedByUserId: req.user.sub,
                status: NotificationStatus.SUCCESS,
                type: NotificationType.CREATE_FORM,
                userId: null,
                formId: formId,
            });

            this.eventEmitter.emit('user.created', eventData);
        } else if (actionType === ActionType.CREATE_FORM_QUESTION) {
            // create notification event
            const eventData: CreateNotificationEvent[] = [];

            adminUsers.forEach((user) => {
                eventData.push({
                    sentByUserId: req.user.sub,
                    receivedByUserId: user.id,
                    status: NotificationStatus.SUCCESS,
                    type: NotificationType.CREATE_FORM_QUESTION,
                    userId: null,
                    formId: formId,
                });
            });

            eventData.push({
                sentByUserId: req.user.sub,
                receivedByUserId: req.user.sub,
                status: NotificationStatus.SUCCESS,
                type: NotificationType.CREATE_FORM_QUESTION,
                userId: null,
                formId: formId,
            });

            this.eventEmitter.emit('user.created', eventData);
        } else if (actionType === ActionType.UPDATE_FORM) {
            // create notification event
            const eventData: CreateNotificationEvent[] = [];

            adminUsers.forEach((user) => {
                eventData.push({
                    sentByUserId: req.user.sub,
                    receivedByUserId: user.id,
                    status: NotificationStatus.SUCCESS,
                    type: NotificationType.UPDATE_FORM,
                    userId: null,
                    formId: formId,
                });
            });

            eventData.push({
                sentByUserId: req.user.sub,
                receivedByUserId: req.user.sub,
                status: NotificationStatus.SUCCESS,
                type: NotificationType.UPDATE_FORM,
                userId: null,
                formId: formId,
            });

            this.eventEmitter.emit('user.created', eventData);
        } else if (actionType === ActionType.UPDATE_FORM_QUESTION) {
            // create notification event
            const eventData: CreateNotificationEvent[] = [];

            adminUsers.forEach((user) => {
                eventData.push({
                    sentByUserId: req.user.sub,
                    receivedByUserId: user.id,
                    status: NotificationStatus.SUCCESS,
                    type: NotificationType.UPDATE_FORM_QUESTION,
                    userId: null,
                    formId: formId,
                });
            });

            eventData.push({
                sentByUserId: req.user.sub,
                receivedByUserId: req.user.sub,
                status: NotificationStatus.SUCCESS,
                type: NotificationType.UPDATE_FORM_QUESTION,
                userId: null,
                formId: formId,
            });

            this.eventEmitter.emit('user.created', eventData);
        } else if (actionType === ActionType.DELETE_FORM) {
            // create notification event
            const eventData: CreateNotificationEvent[] = [];

            adminUsers.forEach((user) => {
                eventData.push({
                    sentByUserId: req.user.sub,
                    receivedByUserId: user.id,
                    status: NotificationStatus.SUCCESS,
                    type: NotificationType.DELETE_FORM,
                    userId: null,
                    formId: formId,
                });
            });

            eventData.push({
                sentByUserId: req.user.sub,
                receivedByUserId: req.user.sub,
                status: NotificationStatus.SUCCESS,
                type: NotificationType.DELETE_FORM,
                userId: null,
                formId: formId,
            });

            this.eventEmitter.emit('user.created', eventData);
        } else if (actionType === ActionType.RESTORE_FORM) {
            // create notification event
            const eventData: CreateNotificationEvent[] = [];

            adminUsers.forEach((user) => {
                eventData.push({
                    sentByUserId: req.user.sub,
                    receivedByUserId: user.id,
                    status: NotificationStatus.SUCCESS,
                    type: NotificationType.RESTORE_FORM,
                    userId: null,
                    formId: formId,
                });
            });

            eventData.push({
                sentByUserId: req.user.sub,
                receivedByUserId: req.user.sub,
                status: NotificationStatus.SUCCESS,
                type: NotificationType.RESTORE_FORM,
                userId: null,
                formId: formId,
            });

            this.eventEmitter.emit('user.created', eventData);
        } else if (actionType === ActionType.UPDATE_STATUS) {
            // create notification event
            const eventData: CreateNotificationEvent[] = [];
            let notificationType: NotificationType;
            const form = await this.formService.findOne(formId);
            const user = await this.userService.findOne(form.createdBy);

            if (form.status === FormStatus.ACCEPTED) notificationType = NotificationType.ACCEPT_FORM;
            else if (form.status === FormStatus.REJECTED) notificationType = NotificationType.REJECT_FORM;
            else if (form.status === FormStatus.CLOSED) notificationType = NotificationType.CLOSE_FORM;

            adminUsers.forEach((user) => {
                eventData.push({
                    sentByUserId: req.user.sub,
                    receivedByUserId: user.id,
                    status: NotificationStatus.SUCCESS,
                    type: notificationType as NotificationType,
                    userId: null,
                    formId: formId,
                });
            });

            eventData.push({
                sentByUserId: req.user.sub,
                receivedByUserId: req.user.sub,
                status: NotificationStatus.SUCCESS,
                type: notificationType as NotificationType,
                userId: null,
                formId: formId,
            });

            if (user.role.value === RoleType.USER) {
                eventData.push({
                    sentByUserId: req.user.sub,
                    receivedByUserId: user.id,
                    status: NotificationStatus.SUCCESS,
                    type: notificationType as NotificationType,
                    userId: null,
                    formId: formId,
                });
            }

            this.eventEmitter.emit('user.created', eventData);
        }
    }
}
