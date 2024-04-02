import {
    EmailExistException,
    EmailNotExistException,
    InternalServerErrorBusinessException,
    PassWordIncorrectException,
    RefreshTokenInvalidException,
    RefreshTokenNotFoundException,
    RoleNotExistException,
    TokenInvalidException,
    TokenJustSendException,
    UserExistException,
    UserNotExistException,
} from '../exceptions/business.exception';

export class Errors {
    static TokenJustSend(minuteWait: number) {
        return new TokenJustSendException(minuteWait);
    }
    static TokenInvalid() {
        return new TokenInvalidException();
    }

    static EmailExist(email?: string) {
        return new EmailExistException(email);
    }
    static EmailNotExist(email?: string) {
        return new EmailNotExistException(email);
    }
    static UserExist(id?: string) {
        return new UserExistException(id);
    }
    static UserNotExist(id?: string) {
        return new UserNotExistException(id);
    }
    static RoleNotExist(id?: string) {
        return new RoleNotExistException(id);
    }
    static PassWordIncorrect() {
        return new PassWordIncorrectException();
    }
    static RefreshTokenNotFound() {
        return new RefreshTokenNotFoundException();
    }
    static RefreshTokenInvalid() {
        return new RefreshTokenInvalidException();
    }

    static InternalServerErrorBusiness(errMessage: string) {
        return new InternalServerErrorBusinessException({ errMessage });
    }
}
