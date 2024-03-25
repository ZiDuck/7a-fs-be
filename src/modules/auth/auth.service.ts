import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';

import { PasswordService } from './password.service';
import { LoginInput } from './dto/login.input';
import { Token } from './dto/auth.output';
import { Repository } from 'typeorm';
import { env } from '../../cores/utils/env.util';
import { CreateUserInput } from '../users/dto/create-user.input';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ForgotPasswordInput } from './dto/forgot-password.input';
import { ForgottenPassword } from '../users/entities/forgotten-password.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from '../email/email.service';
import { ResetPasswordInput } from './dto/reset-password.input';
import { Errors } from '../../common/errors';
import { PassWordIncorrectException } from '../../common/exceptions/business.exception';
import { RoleType } from '../../cores/constants';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(ForgottenPassword) private forgottenPasswordRepository: Repository<ForgottenPassword>,
        private userService: UsersService,
        private passwordService: PasswordService,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) {}

    async register(data: CreateUserInput): Promise<User> {
        const result = await this.userService.create(data);
        return result;
    }

    async validateUser(email: string, password: string) {
        const result = await this.userService.findOneByEmail(email);

        const validPassword = await this.passwordService.validatePassword(result.hashedPassword, password);

        if (result && validPassword) {
            return result;
        }
        return null;
    }

    async login(data: LoginInput): Promise<{ token: Token; userId: string } | null> {
        const user = await this.validateUser(data.email, data.password);

        if (user) {
            if (user.role.value === RoleType.GUEST) throw new ForbiddenException(`The user does not have permission to perform the login function`);

            const tokenSession = await this.generateToken({ sub: user.id, email: user.email });

            await this.userService.createRefreshToken(user.id, tokenSession.token.refreshToken, tokenSession.sessionId);

            return { token: tokenSession.token, userId: user.id };
        }

        return null;
    }

    async logout(userId: string, refreshToken: string, sessionId: string): Promise<boolean> {
        const result = await this.userService.deleteRefreshToken(userId, refreshToken, sessionId);

        return result;
    }

    async refreshToken(userId: string, refreshToken: string, sessionId: string): Promise<Token> {
        const user = await this.userService.findRefreshTokenByUserId(userId, refreshToken, sessionId);

        if (user && user.userSessions.length > 0) {
            const tokenSession = await this.generateToken({ sub: user.id, email: user.email });

            await this.userService.updateRefreshToken(user.id, refreshToken, tokenSession.token.refreshToken, tokenSession.sessionId);

            return tokenSession.token;
        }

        throw new ForbiddenException();
    }

    async createForgottenPasswordToken(email: string, userId: string): Promise<ForgottenPassword> {
        const forgottenPassword = await this.forgottenPasswordRepository.findOne({ where: { email, userId } });

        if (forgottenPassword && (new Date().getTime() - forgottenPassword.createdDate.getTime()) / 60000 < 15) throw Errors.TokenJustSend();

        const data = {
            email,
            newPasswordToken: uuid(),
            expiredDate: dayjs().add(1, 'day').toDate(),
            userId,
        };

        await this.forgottenPasswordRepository.upsert(data, ['email']);

        return this.forgottenPasswordRepository.findOne({ where: { email: email } });
    }

    async forgotPassword(data: ForgotPasswordInput) {
        const user = await this.userService.findOneByEmail(data.email);

        const forgottenPasswordToken = await this.createForgottenPasswordToken(user.email, user.id);

        if (forgottenPasswordToken && forgottenPasswordToken.newPasswordToken) {
            // Send email
            await this.emailService.sendUserForgotPassword(user.email, forgottenPasswordToken.newPasswordToken);
        } else {
            throw new ForbiddenException();
        }
    }

    async resetPassword(data: ResetPasswordInput) {
        let isNewPasswordChanged: boolean = false;

        if (data.email && data.currentPassword) {
            const user = await this.userService.findOneByEmail(data.email);

            const isValidPassword = await this.passwordService.validatePassword(user.hashedPassword, data.currentPassword);

            if (isValidPassword) {
                isNewPasswordChanged = await this.userService.setPassword(data.email, data.newPassword);
            } else {
                throw new PassWordIncorrectException();
            }
        } else if (data.newPasswordToken) {
            const forgottenPassword = await this.forgottenPasswordRepository.findOne({
                where: { newPasswordToken: data.newPasswordToken },
            });

            const user = await this.userService.findOneByEmail(forgottenPassword.email);

            if (forgottenPassword && forgottenPassword.expiredDate && forgottenPassword.expiredDate > new Date()) {
                isNewPasswordChanged = await this.userService.setPassword(forgottenPassword.email, data.newPassword);

                if (isNewPasswordChanged) await this.forgottenPasswordRepository.delete({ email: forgottenPassword.email });
            } else {
                throw Errors.TokenInvalid();
            }
        }
    }

    getExpireTime(): Date {
        const expiresIn = env.String('ACCESS_TOKEN_EXPIRE_TIME');
        const unit = (expiresIn.match(/[a-z]+/g) as RegExpMatchArray)[0];
        const value = (expiresIn.match(/\d+/g) as RegExpMatchArray)[0];
        const expiresTime = dayjs().add(+value, unit as dayjs.ManipulateType);
        return expiresTime.toDate();
    }

    async generateToken(payload: { sub: string; email: string }): Promise<{ token: Token; sessionId: string }> {
        const accessSecret: string = env.String('JWT_ACCESS_SECRET');
        const refreshSecret: string = env.String('JWT_REFRESH_SECRET');
        const sessionId: string = uuid();

        const accessToken = await this.jwtService.signAsync(
            { ...payload, sessionId },
            {
                expiresIn: env.String('ACCESS_TOKEN_EXPIRE_TIME'),
                secret: accessSecret,
            },
        );

        const refreshToken = await this.jwtService.signAsync(
            { ...payload, sessionId },
            {
                expiresIn: env.String('REFRESH_TOKEN_EXPIRE_TIME'),
                secret: refreshSecret,
            },
        );

        const expiredTime = this.getExpireTime();

        return {
            token: {
                accessToken,
                refreshToken,
                expiredTime,
            },
            sessionId,
        };
    }
}
