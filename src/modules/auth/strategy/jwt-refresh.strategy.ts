import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { env } from '../../../cores/utils/env.util';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { PayloadDto } from '../dto/payload.dto';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: env.String('JWT_REFRESH_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: PayloadDto) {
        const email: string = payload.email;
        const user: User = await this.usersService.findOneByEmail(email);
        if (!user) throw new UnauthorizedException();
        const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
        return { ...payload, refreshToken };
    }
}
