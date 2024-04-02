import { CreateNotificationDto } from '../dto/create-notification.dto';

export class CreateNotificationEvent extends CreateNotificationDto {
    constructor(data: CreateNotificationDto) {
        super();
        Object.assign(this, data);
    }
}
