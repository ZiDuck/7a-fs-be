import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtAuthGuard } from '../../cores/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '../../cores/guards/jwt-refresh-auth.guard';
import { RefreshAuth } from '../../cores/guards/refresh-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForgottenPassword } from '../users/entities/forgotten-password.entity';

@Module({
    imports: [forwardRef(() => UsersModule), JwtModule.register({}), PassportModule, TypeOrmModule.forFeature([ForgottenPassword])],
    controllers: [AuthController],
    providers: [AuthService, PasswordService, JwtStrategy, JwtAuthGuard, JwtRefreshStrategy, JwtRefreshAuthGuard, RefreshAuth],
    exports: [AuthService, PasswordService],
})
export class AuthModule {}
