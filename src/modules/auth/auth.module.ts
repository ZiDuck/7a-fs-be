import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAuthGuard } from '../../cores/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '../../cores/guards/jwt-refresh-auth.guard';
import { RefreshAuth } from '../../cores/guards/refresh-auth.guard';
import { ForgottenPassword } from '../users/entities/forgotten-password.entity';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';

@Module({
    imports: [forwardRef(() => UsersModule), JwtModule.register({}), PassportModule, TypeOrmModule.forFeature([ForgottenPassword])],
    controllers: [AuthController],
    providers: [AuthService, PasswordService, JwtStrategy, JwtAuthGuard, JwtRefreshStrategy, JwtRefreshAuthGuard, RefreshAuth],
    exports: [AuthService, PasswordService],
})
export class AuthModule {}
