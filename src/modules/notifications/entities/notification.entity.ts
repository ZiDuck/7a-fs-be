import { ChildEntity, Column, Entity, JoinColumn, ManyToOne, Relation, TableInheritance } from 'typeorm';

import { AppBaseEntity } from '../../../common/entities/base.entity';
import { NotificationStatus, NotificationType } from '../../../cores/constants';
import { User } from '../../users/entities/user.entity';
import { GetFormMetadata, GetUserMetadata } from '../dto/get-notification.output';

type NotificationInfo = {
    title: string;
    description: string;
    metadata: GetUserMetadata | GetFormMetadata | null;
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

    getNotificationInfo(params: any): NotificationInfo {
        throw new Error('Không thực hiện được.');
    }
}

@ChildEntity(NotificationType.CREATE_USER)
export class CreateUserNotification extends Notification {
    getNotificationInfo(params: any): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Tạo mới người dùng',
                    description: `Bạn vừa tạo mới một tài khoản ${params?.fullName}`,
                    metadata: { userId: this.userId, fullName: params?.fullName },
                };
            }

            return {
                title: 'Tạo mới người dùng',
                description: `${this.userSent.getName()} vừa tạo mới một tài khoản ${params?.fullName}`,
                metadata: { userId: this.userId, fullName: params?.fullName },
            };
        }
    }
}

@ChildEntity(NotificationType.UPDATE_USER)
export class UpdateUserNotification extends Notification {
    getNotificationInfo(params: any): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Cập nhật người dùng',
                    description: `Bạn vừa cập nhật tài khoản ${params?.fullName}`,
                    metadata: { userId: this.userId, fullName: params?.fullName },
                };
            }

            return {
                title: 'Tạo mới người dùng',
                description: `${this.userSent.getName()} cập nhật tài khoản ${params?.fullName}`,
                metadata: { userId: this.userId, fullName: params?.fullName },
            };
        }
    }
}

@ChildEntity(NotificationType.DElETE_USER)
export class DeleteUserNotification extends Notification {
    getNotificationInfo(params: any): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Xóa người dùng',
                    description: `Bạn vừa xóa tài khoản ${params?.fullName}`,
                    metadata: { userId: this.userId, fullName: params?.fullName },
                };
            }

            return {
                title: 'Xóa người dùng',
                description: `${this.userSent.getName()} vừa xóa tài khoản ${params?.fullName}`,
                metadata: { userId: this.userId, fullName: params?.fullName },
            };
        }
    }
}

@ChildEntity(NotificationType.RESTORE_USER)
export class RestoreUserNotification extends Notification {
    getNotificationInfo(params: any): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Khôi phục tài khoản',
                    description: `Bạn vừa khôi phục tài khoản ${params?.fullName}`,
                    metadata: { userId: this.userId, fullName: params?.fullName },
                };
            }

            return {
                title: 'Khôi phục người dùng',
                description: `${this.userSent.getName()} vừa khôi phục tài khoản ${params?.fullName}`,
                metadata: { userId: this.userId, fullName: params?.fullName },
            };
        }
    }
}

@ChildEntity(NotificationType.BACKUP_DATA)
export class DataUpdateNotification extends Notification {
    getNotificationInfo(params: any): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            return {
                title: 'Backup dữ liệu',
                description: 'Hệ thống vừa backup dữ liệu thành công',
                metadata: null,
            };
        }
    }
}

@ChildEntity(NotificationType.CREATE_FORM)
export class CreateFormNotification extends Notification {
    getNotificationInfo(params: any): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Tạo mới form',
                    description: `Bạn vừa tạo thành công form ${params?.title}`,
                    metadata: { formId: this.formId, title: params?.title },
                };
            }

            return {
                title: 'Tạo mới form',
                description: `${this.userSent.getName()} vừa tạo thành công form ${params?.title}`,
                metadata: { formId: this.formId, title: params?.title },
            };
        }
    }
}

@ChildEntity(NotificationType.CREATE_FORM_QUESTION)
export class CreateFormQuestionNotification extends Notification {
    getNotificationInfo(params: any): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Tạo mới câu hỏi cho form',
                    description: `Bạn vừa tạo thành công câu hỏi cho form ${params?.title}`,
                    metadata: { formId: this.formId, title: params?.title },
                };
            }

            return {
                title: 'Tạo mới câu hỏi cho form',
                description: `${this.userSent.getName()} vừa tạo thành công câu hỏi cho form ${params?.title}`,
                metadata: { formId: this.formId, title: params?.title },
            };
        }
    }
}

@ChildEntity(NotificationType.UPDATE_FORM)
export class UpdateFormNotification extends Notification {
    getNotificationInfo(params: any): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Cập nhật form',
                    description: `Bạn vừa cập nhật thành công form ${params?.title}`,
                    metadata: { formId: this.formId, title: params?.title },
                };
            }

            return {
                title: 'Cập nhật form',
                description: `${this.userSent.getName()} vừa cập nhật thành công form ${params?.title}`,
                metadata: { formId: this.formId, title: params?.title },
            };
        }
    }
}

@ChildEntity(NotificationType.UPDATE_FORM_QUESTION)
export class UpdateFormQuestionNotification extends Notification {
    getNotificationInfo(params: any): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Cập nhật câu hỏi cho form',
                    description: `Bạn vừa cập nhật thành công câu hỏi cho form ${params?.title}`,
                    metadata: { formId: this.formId, title: params?.title },
                };
            }

            return {
                title: 'Cập nhật câu hỏi cho form',
                description: `${this.userSent.getName()} vừa cập nhật thành công câu hỏi cho form ${params?.title}`,
                metadata: { formId: this.formId, title: params?.title },
            };
        }
    }
}

@ChildEntity(NotificationType.DELETE_FORM)
export class DeleteFormNotification extends Notification {
    getNotificationInfo(params: any): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Xóa form',
                    description: `Bạn đã xóa thành công form ${params?.title}`,
                    metadata: { formId: this.formId, title: params?.title },
                };
            }

            return {
                title: 'Xóa form',
                description: `${this.userSent.getName()} đã xóa thành công form ${params?.title}`,
                metadata: { formId: this.formId, title: params?.title },
            };
        }
    }
}

@ChildEntity(NotificationType.ACCEPT_FORM)
export class AcceptedFormNotification extends Notification {
    getNotificationInfo(params: any): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Duyệt form',
                    description: `Bạn vừa duyệt thành công form ${params?.title}`,
                    metadata: { formId: this.formId, title: params?.title },
                };
            }

            return {
                title: 'Duyệt form',
                description: `${this.userSent.getName()} vừa duyệt thành công form ${params?.title}`,
                metadata: { formId: this.formId, title: params?.title },
            };
        }
    }
}

@ChildEntity(NotificationType.CANCEL_FORM)
export class CancelFormNotification extends Notification {
    getNotificationInfo(params: any): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Hủy form',
                    description: `Bạn đã hủy thành công  form ${params?.title}`,
                    metadata: { formId: this.formId, title: params?.title },
                };
            }

            return {
                title: 'Hủy form',
                description: `${this.userSent.getName()} đã hủy thành công form ${params?.title}`,
                metadata: { formId: this.formId, title: params?.title },
            };
        }
    }
}

@ChildEntity(NotificationType.REJECT_FORM)
export class RejectedFormNotification extends Notification {
    getNotificationInfo(params: any): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Từ chối form',
                    description: `Bạn đã từ chối thành công form ${params?.title}`,
                    metadata: { formId: this.formId, title: params?.title },
                };
            }

            return {
                title: 'Từ chối form',
                description: `${this.userSent.getName()} đã từ chối thành công cho form ${params?.title}`,
                metadata: { formId: this.formId, title: params?.title },
            };
        }
    }
}

@ChildEntity(NotificationType.RESTORE_FORM)
export class RestoreFormNotification extends Notification {
    getNotificationInfo(params: any): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Khôi phục form',
                    description: `Bạn đã khôi phục thành công form ${params?.title}`,
                    metadata: { formId: this.formId, title: params?.title },
                };
            }

            return {
                title: 'Khôi phục form',
                description: `${this.userSent.getName()} đã khôi phục thành công form ${params?.title}`,
                metadata: { formId: this.formId, title: params?.title },
            };
        }
    }
}

@ChildEntity(NotificationType.CLOSE_FORM)
export class CloseFormNotification extends Notification {
    getNotificationInfo(params: any): NotificationInfo {
        if (this.status === NotificationStatus.SUCCESS) {
            if (this.userSent.id === this.userReceived.id) {
                return {
                    title: 'Đóng form',
                    description: `Bạn đã đóng thành công form ${params?.title}`,
                    metadata: { formId: this.formId, title: params?.title },
                };
            }

            return {
                title: 'Đóng form',
                description: `${this.userSent.getName()} đã đóng thành công form ${params?.title}`,
                metadata: { formId: this.formId, title: params?.title },
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
    RestoreFormNotification,
    CloseFormNotification,
    RejectedFormNotification,
];
