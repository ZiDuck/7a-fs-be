import { ApiProperty } from '@nestjs/swagger';
import { NotificationStatus, NotificationType } from '../../../cores/constants';
import { Expose } from 'class-transformer';

class GetUser {
    @ApiProperty({ type: String })
    @Expose()
    id: string;

    @ApiProperty({ type: String })
    @Expose()
    fullName: string;
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

    @ApiProperty({ type: () => GetUser, nullable: true })
    sentBy: GetUser | null;

    @ApiProperty({ type: () => GetUser, nullable: true })
    receivedBy: GetUser | null;

    @ApiProperty({ type: String, nullable: true })
    deviceId: string | null;

    @ApiProperty()
    isRead: boolean;

    @ApiProperty()
    createdDate: Date;
}
