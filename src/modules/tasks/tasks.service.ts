import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { Transactional } from 'typeorm-transactional';

import { BackupService } from '../backup/backup.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileHistoryService } from '../file-history/file-history.service';
import { FormsService } from '../forms/forms.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
    constructor(
        private cloudinaryService: CloudinaryService,
        private fileHistoryService: FileHistoryService,
        private backupService: BackupService,
        private notificationService: NotificationsService,
        private userService: UsersService,
        private formService: FormsService,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async performDailyTasks() {
        await Promise.all([this.removeOldNotifications(), this.removeOldForms(), this.removeOldUsers()]);
    }

    @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
    async performMonthlyTasks() {
        await Promise.all([this.backupData()]);
    }

    private async removeFilesOnCloudinary() {
        const { startDate, endDate } = this.getOneDayInterval();
        const filesHistory = await this.getFilesHistory(startDate, endDate);

        for (const fileHistory of filesHistory) {
            await this.handleFileHistory(fileHistory);
        }
    }

    private async removeOldFileHistories() {
        const currentDate = dayjs().startOf('hour').toISOString();
        await this.fileHistoryService.removeRawFiles({
            endDate: currentDate,
            startDate: null,
        });
    }

    private async backupData() {
        await this.backupService.dataBackupService();
    }

    @Transactional()
    private async removeOldNotifications() {
        const thirtyDaysAgo = dayjs().subtract(30, 'day').toISOString();
        await this.notificationService.removeOlderThan(thirtyDaysAgo);
    }

    @Transactional()
    async removeOldUsers() {
        const thirtyDaysAgo = dayjs().subtract(30, 'day').toISOString();
        await this.userService.removeOlderThan(thirtyDaysAgo);
    }

    @Transactional()
    async removeOldForms() {
        const thirtyDaysAgo = dayjs().subtract(30, 'day').toISOString();
        await this.formService.removeOlderThan(thirtyDaysAgo);
    }

    private getOneDayInterval() {
        const currentDate = dayjs().toISOString();
        const oneDayAgo = dayjs().subtract(1, 'day').toISOString();
        return { startDate: oneDayAgo, endDate: currentDate };
    }

    private async getFilesHistory(startDate: string, endDate: string) {
        return await this.fileHistoryService.findAllHasNotDeletedAndNotPaginate({
            startDate,
            endDate,
        });
    }

    private async handleFileHistory(fileHistory: any) {
        const isExisted = await this.cloudinaryService.checkResourcesExists({
            publicId: fileHistory.publicId,
            resourceType: fileHistory.resourceType,
        });

        if (isExisted) {
            await this.cloudinaryService.deleteResources([fileHistory.publicId], fileHistory.resourceType);
        }

        await this.fileHistoryService.update(fileHistory.id, { hasDeleted: true });
    }
}
