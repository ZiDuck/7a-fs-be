import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { Repository } from 'typeorm';

import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { CurrentUserContext } from '../../cores/providers/current-user-context.provider';
import { paginate } from '../../cores/utils/paginate.util';
import { FormsService } from '../forms/forms.service';
import { UsersService } from '../users/users.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { GetFormMetadata, GetNotificationOutput, GetUserMetadata } from './dto/get-notification.output';
import { Notification } from './entities/notification.entity';
import { RemoveFormEvent } from './events/remove-form.event';
import { RemoveUserEvent } from './events/remove-user.event';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
        private readonly currentUserContext: CurrentUserContext,
        private readonly usersService: UsersService,
        private readonly formsService: FormsService,
        private readonly cls: ClsService,
    ) {}

    async create(data: CreateNotificationDto[]) {
        const result = this.notificationRepository.create(data);
        await this.notificationRepository.save(result);
        return result;
    }

    async findAll(query: PageQueryDto) {
        const currentUserId = this.currentUserContext.getUserId();

        const builder = this.findAllBuilder(currentUserId);
        const result = await paginate(builder, query);

        const results = {
            ...result,
            items: await Promise.all(
                result.items.map((notification) => {
                    return this.customizeResult(notification);
                }),
            ),
        };

        return results;
    }

    async findAllRead(query: PageQueryDto) {
        const currentUserId = this.currentUserContext.getUserId();

        const builder = this.findAllBuilder(currentUserId).andWhere('noti.isRead=true');
        const result = await paginate(builder, query);

        const results = {
            ...result,
            items: await Promise.all(
                result.items.map((notification) => {
                    return this.customizeResult(notification);
                }),
            ),
        };

        return results;
    }

    async findAllUnread(query: PageQueryDto) {
        const currentUserId = this.currentUserContext.getUserId();

        const builder = this.findAllBuilder(currentUserId).andWhere('noti.isRead=false');
        const result = await paginate(builder, query);

        const results = {
            ...result,
            items: await Promise.all(
                result.items.map((notification) => {
                    return this.customizeResult(notification);
                }),
            ),
        };

        return results;
    }

    private findAllBuilder(currentUserId: string) {
        return this.notificationRepository
            .createQueryBuilder('noti')
            .leftJoinAndSelect('noti.userReceived', 'receiver')
            .leftJoinAndSelect('noti.userSent', 'sent')
            .where('noti.receivedByUserId=:userId', { userId: currentUserId })
            .orderBy('noti.createdDate', 'DESC');
    }

    async findOne(id: string) {
        const notification = await this.notificationRepository.findOne({
            where: {
                id,
            },
            relations: {
                userReceived: true,
                userSent: true,
            },
        });

        if (!notification) {
            throw new BadRequestException('Notification not found');
        }

        return this.customizeResult(notification);
    }

    async findAllUnreadNoPagination() {
        const currentUserId = this.currentUserContext.getUserId();

        const results = await this.notificationRepository.find({
            where: {
                isRead: false,
                receivedByUserId: currentUserId,
            },
            relations: {
                userReceived: true,
                userSent: true,
            },
        });

        return await Promise.all(
            results.map((notification) => {
                return this.customizeResult(notification);
            }),
        );
    }

    async update(id: string) {
        const notification = await this.findOne(id);

        notification.isRead = true;

        const result = await this.notificationRepository.save(notification);

        return result ? true : false;
    }

    async updateAllRead() {
        const notifications = await this.findAllUnreadNoPagination();

        // notification.isRead = true;

        notifications.map((notification) => (notification.isRead = true));

        const results = await this.notificationRepository.save(notifications);

        return results ? true : false;
    }

    async removeOlderThan(date: string) {
        return this.notificationRepository.createQueryBuilder().delete().where('createdDate < :date', { date }).execute();
    }

    async removeNotificationByFormId(formId: RemoveFormEvent) {
        const notifications = await this.notificationRepository
            .createQueryBuilder('notification')
            .where('notification.formId=:formId', { formId })
            .getMany();

        if (notifications.length > 0) {
            await this.notificationRepository.remove(notifications);
        }
    }

    async removeNotificationByUserId(userId: RemoveUserEvent) {
        const notifications = await this.notificationRepository
            .createQueryBuilder('notification')
            .where('notification.userId=:userId', { userId })
            .getMany();

        if (notifications.length > 0) {
            await this.notificationRepository.remove(notifications);
        }
    }

    private async customizeResult(notification: Notification) {
        const data = new GetNotificationOutput();

        data.id = notification.id;
        data.sentBy = !notification.userSent
            ? null
            : {
                  id: notification.userSent.id,
                  fullName: notification.userSent.getName(),
              };

        data.receivedBy = !notification.userReceived
            ? null
            : {
                  id: notification.userReceived.id,
                  fullName: notification.userReceived.getName(),
              };
        data.status = notification.status;
        data.type = notification.type;
        data.createdDate = notification.createdDate;
        data.isRead = notification.isRead;

        let params: GetUserMetadata | GetFormMetadata | null = null;

        if (notification.userId) {
            const user = await this.usersService.findOneDeletedNotThrowError(notification.userId);
            params = { userId: user?.id ?? '', fullName: user ? user.getName() : '' };
        } else if (notification.formId) {
            const form = await this.formsService.findOneDeletedNotThrowError(notification.formId);
            params = { formId: form?.id ?? '', title: form ? form.title : '' };
        }

        const notificationInfo = notification.getNotificationInfo(params);

        data.title = notificationInfo.title;
        data.description = notificationInfo.description;
        data.metadata = notificationInfo.metadata;

        return data;
    }
}
