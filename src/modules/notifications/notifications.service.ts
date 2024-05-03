import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { Repository } from 'typeorm';
import { GetNotificationOutput } from './dto/get-notification.output';
import { CurrentUserContext } from '../../cores/providers/current-user-context.provider';
import { paginate } from '../../cores/utils/paginate.util';
import { PageQueryDto } from '../../common/dtos/page-query.dto';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
        private readonly currentUserContext: CurrentUserContext,
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
            items: result.items.map((notification) => {
                return this.customizeResult(notification);
            }),
        };

        return results;
    }

    async findAllRead(query: PageQueryDto) {
        const currentUserId = this.currentUserContext.getUserId();

        const builder = this.findAllBuilder(currentUserId).andWhere('noti.isRead=true');
        const result = await paginate(builder, query);

        const results = {
            ...result,
            items: result.items.map((notification) => {
                return this.customizeResult(notification);
            }),
        };

        return results;
    }

    async findAllUnread(query: PageQueryDto) {
        const currentUserId = this.currentUserContext.getUserId();

        const builder = this.findAllBuilder(currentUserId).andWhere('noti.isRead=false');
        const result = await paginate(builder, query);

        const results = {
            ...result,
            items: result.items.map((notification) => {
                return this.customizeResult(notification);
            }),
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

        return results.map((notification) => {
            return this.customizeResult(notification);
        });
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

    async removeNotificationsOlderThan(date: string) {
        const notifications = await this.notificationRepository
            .createQueryBuilder('notification')
            .where('notification.createdDate < :date', { date })
            .getMany();

        if (notifications.length > 0) {
            await this.notificationRepository.remove(notifications);
        }
    }

    private customizeResult(notification: Notification) {
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

        const notificationInfo = notification.getNotificationInfo();

        data.title = notificationInfo.title;
        data.description = notificationInfo.description;

        return data;
    }
}
