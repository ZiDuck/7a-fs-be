import { BadRequestException, Body, Controller, HttpException, InternalServerErrorException, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { plainToInstance } from 'class-transformer';
import { LoginInput } from './dto/login.input';
import { Token } from './dto/auth.output';
import { Request } from 'express';
import { CreateUserInput } from '../users/dto/create-user.input';
import { GetUserDto } from '../users/dto/get-user.dto';
import { AdminRole } from '../../cores/decorators/role.decorator';
import { UseAccessRefreshGuard } from '../../cores/decorators/use-access-refresh.decorator';
import { CurrentUser } from '../../cores/decorators/user.decorator';
import { ForgotPasswordInput } from './dto/forgot-password.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { UsersService } from '../users/users.service';
import { Transactional } from 'typeorm-transactional';
import { ClsService } from 'nestjs-cls';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService,
        private readonly cls: ClsService,
    ) {}

    @ApiBearerAuth()
    @AdminRole()
    @Transactional()
    @Post('register')
    async signup(@CurrentUser() userId: string, @Body() data: CreateUserInput): Promise<GetUserDto> {
        try {
            const result = await this.userService.create(data);
            return plainToInstance(GetUserDto, result);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

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
