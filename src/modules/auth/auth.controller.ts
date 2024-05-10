import { BadRequestException, Body, Controller, HttpException, InternalServerErrorException, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ClsService } from 'nestjs-cls';
import { Transactional } from 'typeorm-transactional';

import { UseAccessRefreshGuard } from '../../cores/decorators/use-access-refresh.decorator';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { Token } from './dto/auth.output';
import { ForgotPasswordInput } from './dto/forgot-password.input';
import { LoginInput } from './dto/login.input';
import { ResetPasswordInput } from './dto/reset-password.input';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService,
        private readonly cls: ClsService,
    ) {}

    @Transactional()
    @Post('login')
    async login(@Body() data: LoginInput): Promise<Token | null> {
        const result = await this.authService.login(data);
        return result.token;
    }

    @ApiBearerAuth()
    @UseAccessRefreshGuard()
    @Post('refresh-token')
    async refresh(@Req() req: Request): Promise<Token | null> {
        const userId = req.user['sub'];
        const refreshToken = req.user['refreshToken'];
        const sessionId = req.user['sessionId'];

        return await this.authService.refreshToken(userId, refreshToken, sessionId);
    }

    @ApiBearerAuth()
    @UseAccessRefreshGuard()
    @Post('logout')
    async logout(@Req() req: Request): Promise<void> {
        const userId = req.user['sub'];
        const refreshToken = req.user['refreshToken'];
        const sessionId = req.user['sessionId'];

        const result = await this.authService.logout(userId, refreshToken, sessionId);
        if (result) return;
        throw new BadRequestException('Đăng xuất thất bại');
    }

    @Transactional()
    @Post('forgot-password')
    async resetPassword(@Body() data: ForgotPasswordInput): Promise<void> {
        try {
            await this.authService.forgotPassword(data);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    @Transactional()
    @Post('reset-password')
    async resetPasswordToken(@Body() data: ResetPasswordInput): Promise<void> {
        try {
            await this.authService.resetPassword(data);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }
}
