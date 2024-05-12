import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { NotificationStatus, NotificationType } from '../../../cores/constants';

class GetUser {
    @ApiProperty({ type: String })
    @Expose()
    id: string;

    @ApiProperty({ type: String })
    @Expose()
    fullName: string;
}

export class GetUserMetadata {
    @ApiProperty({ type: String })
    @Expose()
    userId: string;

    @ApiProperty({ type: String })
    @Expose()
    fullName: string;
}

export class GetFormMetadata {
    @ApiProperty({ type: String })
    @Expose()
    formId: string;

    @ApiProperty({ type: String })
    @Expose()
    title: string;
}

export class GetNotificationOutput {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ enum: NotificationStatus, nullable: true })
    status: NotificationStatus | null;

    @ApiProperty({ enum: NotificationType })
    type: NotificationType;

    @ApiPropertyOptional({ type: () => GetUser, nullable: true })
    sentBy: GetUser | null;

    @ApiProperty({ type: () => GetUser, nullable: true })
    receivedBy: GetUser | null;

    @ApiPropertyOptional()
    formId: string | null;

    @ApiPropertyOptional()
    userId: string | null;

    @ApiProperty()
    isRead: boolean;

    @ApiProperty()
    createdDate: Date;

    @ApiProperty()
    metadata: GetUserMetadata | GetFormMetadata | null;
}
