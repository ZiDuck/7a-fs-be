import { ChildEntity, Column, Entity, JoinColumn, ManyToOne, Relation, TableInheritance } from 'typeorm';

import { AppBaseEntity } from '../../../common/entities/base.entity';
import { NotificationStatus, NotificationType } from '../../../cores/constants';
import { User } from '../../users/entities/user.entity';

type NotificationInfo = {
    title: string;
    description: string;
};

@Entity()
@TableInheritance({ column: { name: 'type', type: 'enum', enum: NotificationType } })
export class Notification extends AppBaseEntity {
    @Column('enum', { enum: NotificationStatus, nullable: true })
    status: NotificationStatus;

    @Column('enum', { enum: NotificationType })
    type: NotificationType;

    @Column('boolean', { default: false })
    isRead: boolean;

    @Column('uuid', { nullable: true })
    formId: string;

    @Column('uuid', { nullable: true })
    userId: string;

    @Column('uuid', { nullable: true })
    sentByUserId: User['id'];

    @JoinColumn({ referencedColumnName: 'id', name: 'sentByUserId' })
    @ManyToOne(() => User, (user: User) => user.notificationsSent, { onDelete: 'CASCADE' })
    userSent: Relation<User>;

    @Column('uuid')
    receivedByUserId: User['id'];

    @JoinColumn({ referencedColumnName: 'id', name: 'receivedByUserId' })
    @ManyToOne(() => User, (user: User) => user.notificationsReceived, { onDelete: 'CASCADE' })
    userReceived: Relation<User>;

    getNotificationInfo(): NotificationInfo {
        throw new Error('Không thực hiện được.');
    }
}

@ChildEntity(NotificationType.CREATE_USER)
export class CreateUserNotification extends Notification {
    getNotificationInfo(): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Tạo mới người dùng',
                    description: `Bạn vừa tạo mới một tài khoản ${this.userId}`,
                };
            }

            return {
                title: 'Tạo mới người dùng',
                description: `${this.userSent.getName()} vừa tạo mới một tài khoản ${this.userId}`,
            };
        }
    }
}

@ChildEntity(NotificationType.UPDATE_USER)
export class UpdateUserNotification extends Notification {
    getNotificationInfo(): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Cập nhật người dùng',
                    description: `Bạn vừa cập nhật tài khoản ${this.userId}`,
                };
            }

            return {
                title: 'Tạo mới người dùng',
                description: `${this.userSent.getName()} cập nhật tài khoản ${this.userId}`,
            };
        }
    }
}

@ChildEntity(NotificationType.DElETE_USER)
export class DeleteUserNotification extends Notification {
    getNotificationInfo(): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Xóa người dùng',
                    description: `Bạn vừa xóa tài khoản ${this.userId}`,
                };
            }

            return {
                title: 'Xóa người dùng',
                description: `${this.userSent.getName()} vừa xóa tài khoản ${this.userId}`,
            };
        }
    }
}

@ChildEntity(NotificationType.RESTORE_USER)
export class RestoreUserNotification extends Notification {
    getNotificationInfo(): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Khôi phục tài khoản',
                    description: `Bạn vừa khôi phục tài khoản ${this.userId}`,
                };
            }

            return {
                title: 'Xóa người dùng',
                description: `${this.userSent.getName()} vừa khôi phục tài khoản ${this.userId}`,
            };
        }
    }
}

@ChildEntity(NotificationType.BACKUP_DATA)
export class DataUpdateNotification extends Notification {
    getNotificationInfo(): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            return {
                title: 'Backup dữ liệu',
                description: 'Hệ thống vừa backup dữ liệu thành công',
            };
        }
    }
}

@ChildEntity(NotificationType.CREATE_FORM)
export class CreateFormNotification extends Notification {
    getNotificationInfo(): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Tạo mới form',
                    description: `Bạn vừa tạo thành công form với id #${this.formId}`,
                };
            }

            return {
                title: 'Tạo mới form',
                description: `${this.userSent.getName()} vừa tạo thành công form với id #${this.formId}`,
            };
        }
    }
}

@ChildEntity(NotificationType.CREATE_FORM_QUESTION)
export class CreateFormQuestionNotification extends Notification {
    getNotificationInfo(): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Tạo mới câu hỏi cho form',
                    description: `Bạn vừa tạo thành công câu hỏi cho form với id #${this.formId}`,
                };
            }

            return {
                title: 'Tạo mới câu hỏi cho form',
                description: `${this.userSent.getName()} vừa tạo thành công câu hỏi cho form với id #${this.formId}`,
            };
        }
    }
}

@ChildEntity(NotificationType.UPDATE_FORM)
export class UpdateFormNotification extends Notification {
    getNotificationInfo(): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Cập nhật form',
                    description: `Bạn vừa cập nhật thành công form với id #${this.formId}`,
                };
            }

            return {
                title: 'Cập nhật form',
                description: `${this.userSent.getName()} vừa cập nhật thành công form với id #${this.formId}`,
            };
        }
    }
}

@ChildEntity(NotificationType.UPDATE_FORM_QUESTION)
export class UpdateFormQuestionNotification extends Notification {
    getNotificationInfo(): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Cập nhật câu hỏi cho form',
                    description: `Bạn vừa cập nhật thành công câu hỏi cho form với id #${this.formId}`,
                };
            }

            return {
                title: 'Cập nhật câu hỏi cho form',
                description: `${this.userSent.getName()} vừa cập nhật thành công câu hỏi cho form với id #${this.formId}`,
            };
        }
    }
}

@ChildEntity(NotificationType.DELETE_FORM)
export class DeleteFormNotification extends Notification {
    getNotificationInfo(): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Xóa form',
                    description: `Bạn xóa thành công form với id #${this.formId}`,
                };
            }

            return {
                title: 'Xóa form',
                description: `${this.userSent.getName()} xóa thành công form với id #${this.formId}`,
            };
        }
    }
}

@ChildEntity(NotificationType.ACCEPT_FORM)
export class AcceptedFormNotification extends Notification {
    getNotificationInfo(): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Duyệt form',
                    description: `Bạn vừa duyệt thành công trạng thái ACCEPTED cho form với id #${this.formId}`,
                };
            }

            return {
                title: 'Duyệt form',
                description: `${this.userSent.getName()} vừa duyệt thành công trạng thái ACCEPTED cho form với id #${this.formId}`,
            };
        }
    }
}

@ChildEntity(NotificationType.CANCEL_FORM)
export class CancelFormNotification extends Notification {
    getNotificationInfo(): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Duyệt form',
                    description: `Bạn đã cập nhật thành công trạng thái CANCEL cho form với id #${this.formId}`,
                };
            }

            return {
                title: 'Duyệt form',
                description: `${this.userSent.getName()} đã cập nhật thành công trạng thái CANCEL cho form với id #${this.formId}`,
            };
        }
    }
}

@ChildEntity(NotificationType.REJECT_FORM)
export class RejectedFormNotification extends Notification {
    getNotificationInfo(): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Duyệt form',
                    description: `Bạn đã cập nhật thành công trạng thái REJECTED cho form với id #${this.formId}`,
                };
            }

            return {
                title: 'Duyệt form',
                description: `${this.userSent.getName()} đã cập nhật thành công trạng thái REJECTED cho form với id #${this.formId}`,
            };
        }
    }
}

@ChildEntity(NotificationType.RESTORE_FORM)
export class RestoreFormNotification extends Notification {
    getNotificationInfo(): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Khôi phục form',
                    description: `Bạn đã khôi phục thành công form với id #${this.formId}`,
                };
            }

            return {
                title: 'Khôi phục form',
                description: `${this.userSent.getName()} đã khôi phục thành công form với id # #${this.formId}`,
            };
        }
    }
}

@ChildEntity(NotificationType.CLOSE_FORM)
export class CloseFormNotification extends Notification {
    getNotificationInfo(): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Đóng form',
                    description: `Bạn đã đóng thành công form với id #${this.formId}`,
                };
            }

            return {
                title: 'Đóng form',
                description: `${this.userSent.getName()} đã đóng thành công form với id # #${this.formId}`,
            };
        }
    }
}

export const entities = [
    Notification,
    CreateUserNotification,
    UpdateUserNotification,
    DeleteUserNotification,
    RestoreUserNotification,
    DataUpdateNotification,
    CreateFormNotification,
    UpdateFormNotification,
    DeleteFormNotification,
    AcceptedFormNotification,
    CancelFormNotification,
    CreateFormQuestionNotification,
    UpdateFormQuestionNotification,
];
