import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { env } from '../utils/env.util';

@Injectable()
export class RefreshAuth implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const refreshToken = this.extractTokenFromBody(request);
        try {
            if (!refreshToken) {
                throw new UnauthorizedException('Refresh token not found in the body');
            }
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: env.String('JWT_REFRESH_SECRET'),
            });
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            if (payload.sessionId !== request.user.sessionId) {
                throw new UnauthorizedException('Refresh token is invalid');
            }
            request['user'] = { ...payload, refreshToken };
        } catch (err) {
            throw err;
        }
        return true;
    }

    private extractTokenFromBody(request: Request): string | undefined {
        const refreshToken = request.body.refreshToken;
        return !refreshToken ? undefined : refreshToken;
    }
}
