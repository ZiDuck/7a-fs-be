export const DEVELOPMENT = 'development';
export const TEST = 'test';
export const PRODUCTION = 'production';

export enum RoleType {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export enum OrderByDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}

export enum NotificationType {
    CREATE_USER = 'CREATE_USER',
    UPDATE_USER = 'UPDATE_USER',
    DElETE_USER = 'DElETE_USER',
    RESTORE_USER = 'RESTORE_USER',
    BACKUP_DATA = 'BACKUP_DATA',
    CREATE_FORM = 'CREATE_FORM',
    UPDATE_FORM = 'UPDATE_FORM',
    DELETE_FORM = 'DELETE_FORM',
    ACCEPTED_FORM = 'ACCEPTED_FORM',
    CANCEL_FORM = 'CANCEL_FORM',
    REJECTED_FORM = 'REJECTED_FORM',
    RESTORE_FORM = 'RESTORE_FORM',
}

export enum NotificationStatus {
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    WARNING = 'WARNING',
}
