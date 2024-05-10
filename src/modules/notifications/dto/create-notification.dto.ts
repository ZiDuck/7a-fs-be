import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { NotificationStatus, NotificationType } from '../../../cores/constants';

export class CreateNotificationDto {
    @IsEnum(NotificationStatus)
    status: NotificationStatus | null;

    @IsEnum(NotificationType)
    type: NotificationType;

    @IsString()
    @IsUUID()
    sentByUserId: string | null;

    @IsString()
    @IsUUID()
    receivedByUserId: string;

    @IsOptional()
    @IsString()
    @IsUUID()
    formId?: string;

    @IsOptional()
    @IsString()
    @IsUUID()
    userId?: string;
}
