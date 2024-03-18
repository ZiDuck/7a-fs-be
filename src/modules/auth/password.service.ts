import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PassWordIncorrectException } from '../../common/exceptions/business.exception';

@Injectable()
export class PasswordService {
    constructor() {}

    async validatePassword(hashedPassword: string, password: string): Promise<boolean> {
        const result = await argon2.verify(hashedPassword, password);
        if (!result) throw new PassWordIncorrectException();
        return result;
    }

    async hashPassword(password: string): Promise<string> {
        const hashedPassword = await argon2.hash(password);
        return hashedPassword;
    }
}
