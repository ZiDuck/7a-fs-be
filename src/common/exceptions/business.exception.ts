import { HttpException, HttpExceptionOptions, HttpStatus } from '@nestjs/common';
import { omit } from 'lodash';

export type BusinessExceptionOption = { messageKey: any; args?: object; [key: string]: any };

export class BusinessException extends HttpException {
    protected extraData: object;
    constructor(response: BusinessExceptionOption, status?: number, options?: HttpExceptionOptions) {
        response.message = response.messageKey;
        super(response, status ?? HttpStatus.BAD_REQUEST, options);

        this.extraData = omit(response, 'message');
    }

    getData() {
        return this.extraData;
    }
}

export class TokenJustSendException extends BusinessException {
    constructor(response?: Record<string, any>, options?: HttpExceptionOptions) {
        super({ messageKey: 'error.The token that was just sent' }, HttpStatus.BAD_REQUEST, options);
    }
}

export class TokenInvalidException extends BusinessException {
    constructor(response?: Record<string, any>, options?: HttpExceptionOptions) {
        super({ messageKey: 'error.The token is invalid or has expired' }, HttpStatus.BAD_REQUEST, options);
    }
}

export class EmailExistException extends BusinessException {
    public email: string;

    constructor(email?: string) {
        super({ messageKey: 'error.Email {email} already exists', args: { email } }, HttpStatus.BAD_REQUEST);
        this.email = email;
    }
}

export class EmailNotExistException extends BusinessException {
    public email: string;

    constructor(email?: string) {
        super({ messageKey: 'error.Email {email} not exists', args: { email } }, HttpStatus.BAD_REQUEST);
        this.email = email;
    }
}

export class UserExistException extends BusinessException {
    public userId: string;

    constructor(id?: string) {
        super({ messageKey: 'error.User with id #{id} already exists', args: { id } }, HttpStatus.BAD_REQUEST);
        this.userId = id;
    }
}

export class UserNotExistException extends BusinessException {
    public userId: string;

    constructor(id?: string) {
        super({ messageKey: 'error.User with id #{id} not exists', args: { id } }, HttpStatus.BAD_REQUEST);
        this.userId = id;
    }
}

export class RoleNotExistException extends BusinessException {
    public roleId: string;

    constructor(id?: string) {
        super({ messageKey: 'error.Role with id #{id} not exists', args: { id } }, HttpStatus.BAD_REQUEST);
        this.roleId = id;
    }
}

export class PassWordIncorrectException extends BusinessException {
    constructor(response?: Record<string, any>, options?: HttpExceptionOptions) {
        super({ messageKey: 'error.Password is incorrect' }, HttpStatus.BAD_REQUEST, options);
    }
}

export class RefreshTokenNotFoundException extends BusinessException {
    constructor(response?: Record<string, any>, options?: HttpExceptionOptions) {
        super({ messageKey: 'error.Refresh token not found in the body' }, HttpStatus.BAD_REQUEST, options);
    }
}

export class RefreshTokenInvalidException extends BusinessException {
    constructor(response?: Record<string, any>, options?: HttpExceptionOptions) {
        super({ messageKey: 'error.Refresh token is invalid' }, HttpStatus.BAD_REQUEST, options);
    }
}
