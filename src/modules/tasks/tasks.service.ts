import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import dayjs from 'dayjs';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileHistoryService } from '../file-history/file-history.service';
import { RawFilesService } from '../raw-files/raw-files.service';

@Injectable()
export class TasksService {
    constructor(
        private cloudinaryService: CloudinaryService,
        private fileHistoryService: FileHistoryService,
        private rawFilesService: RawFilesService,
    ) {}

    @Transactional()
    async removeFileOnCloudinary() {
        // Get all Files of this day from File history
        // Check if each Files existed from the cloudinary
        // If existed, remove the File from cloudinary
        // Remove the File in File table
        // Update hasDeleted = true in File history table
        // Otherwise, remove the File in File table
        // const currentDate = dayjs().startOf('h').toISOString();
        const currentDate = dayjs('2024-04-26 00:00:00.000').toISOString();
        // const oneDateAgo = dayjs().subtract(1, 'd').startOf('h').toISOString();
        const oneDateAgo = dayjs('2024-04-26 00:00:00.000').subtract(1, 'd').toISOString();

        const filesHistory = await this.fileHistoryService.findAllHasNotDeletedAndNotPaginate({
            startDate: oneDateAgo,
            endDate: currentDate,
        });

        for (const fileHistory of filesHistory) {
            const isExisted = await this.cloudinaryService.checkResourcesExists({
                publicId: fileHistory.publicId,
                resourceType: fileHistory.resourceType,
            });

            if (isExisted) {
                await this.cloudinaryService.deleteResources([fileHistory.publicId], fileHistory.resourceType);
            }

            await this.fileHistoryService.update(fileHistory.id, { hasDeleted: true });
        }

        return filesHistory;
    }
}
