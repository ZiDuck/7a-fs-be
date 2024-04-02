import { HttpException, HttpExceptionOptions, HttpStatus } from '@nestjs/common';
import { omit } from 'lodash';

export type BusinessExceptionOption = { message: any; [key: string]: any };

export class BusinessException extends HttpException {
    protected extraData: object;
    constructor(response: BusinessExceptionOption, status?: number, options?: HttpExceptionOptions) {
        response.message = response.message;
        super(response, status ?? HttpStatus.BAD_REQUEST, options);

        this.extraData = omit(response, 'message');
    }

    getData() {
        return this.extraData;
    }
}

export class TokenJustSendException extends BusinessException {
    constructor(minuteWait: number) {
        super(
            {
                message: `Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn. Nếu bạn không nhận được email, hãy chờ ít nhất ${minuteWait} phút trước khi thử gửi yêu cầu mới`,
            },
            HttpStatus.TOO_MANY_REQUESTS,
        );
    }
}

export class TokenInvalidException extends BusinessException {
    constructor(response?: Record<string, any>, options?: HttpExceptionOptions) {
        super({ message: 'The token is invalid or has expired' }, HttpStatus.BAD_REQUEST, options);
    }
}

export class EmailExistException extends BusinessException {
    public email: string;

    constructor(email?: string) {
        super({ message: `Email ${email} already exists` }, HttpStatus.BAD_REQUEST);
        this.email = email;
    }
}

export class EmailNotExistException extends BusinessException {
    public email: string;

    constructor(email?: string) {
        super({ message: `Email ${email} not exists` }, HttpStatus.BAD_REQUEST);
        this.email = email;
    }
}

export class UserExistException extends BusinessException {
    public userId: string;

    constructor(id?: string) {
        super({ message: `User with id #${id} already exists` }, HttpStatus.BAD_REQUEST);
        this.userId = id;
    }
}

export class UserNotExistException extends BusinessException {
    public userId: string;

    constructor(id?: string) {
        super({ message: `User with id #${id} not exists` }, HttpStatus.BAD_REQUEST);
        this.userId = id;
    }
}

export class RoleNotExistException extends BusinessException {
    public roleId: string;

    constructor(id?: string) {
        super({ message: `Role with id #${id} not exists` }, HttpStatus.BAD_REQUEST);
        this.roleId = id;
    }
}

export class PassWordIncorrectException extends BusinessException {
    constructor(response?: Record<string, any>, options?: HttpExceptionOptions) {
        super({ message: 'Password is incorrect' }, HttpStatus.BAD_REQUEST, options);
    }
}

export class RefreshTokenNotFoundException extends BusinessException {
    constructor(response?: Record<string, any>, options?: HttpExceptionOptions) {
        super({ message: 'Refresh token not found in the body' }, HttpStatus.BAD_REQUEST, options);
    }
}

export class RefreshTokenInvalidException extends BusinessException {
    constructor(response?: Record<string, any>, options?: HttpExceptionOptions) {
        super({ message: 'Refresh token is invalid' }, HttpStatus.BAD_REQUEST, options);
    }
}

export class InternalServerErrorBusinessException extends BusinessException {
    constructor(response?: Record<string, any>, options?: HttpExceptionOptions) {
        super({ message: 'Lỗi hệ thống', ...response }, HttpStatus.INTERNAL_SERVER_ERROR, options);
    }
}
