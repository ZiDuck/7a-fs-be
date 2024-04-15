import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PayloadDto } from '../dto/payload.dto';
import { env } from '../../../cores/utils/env.util';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: env.String('JWT_ACCESS_SECRET'),
        });
    }

    async validate(payload: PayloadDto): Promise<PayloadDto> {
        const email: string = payload.email;
        const user: User = await this.usersService.findOneByEmail(email);

        if (!user) throw new UnauthorizedException('Người dùng không tồn tại!');

        return payload;
    }
}
