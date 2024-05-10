import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { env } from '../../cores/utils/env.util';
import { CreateUserSessionInput, DeleteUserSessionInput, UpdateUserSessionInput } from './dto/user-session-token.input';
import { UserSession } from './entities/user-session.entity';

@Injectable()
export class UserSessionsService {
    constructor(
        @InjectRepository(UserSession) private userSessionRepository: Repository<UserSession>,
        private readonly jwtService: JwtService,
    ) {}

    getRepository(): Repository<UserSession> {
        return this.userSessionRepository;
    }

    async create(data: CreateUserSessionInput): Promise<UserSession> {
        const result = this.userSessionRepository.create(data);

        await this.userSessionRepository.save(result);

        return result;
    }

    async findOneByRefreshTokenAndUserId(userId: string, refreshToken: string): Promise<UserSession> {
        const result = await this.userSessionRepository.findOne({ where: { userId, refreshToken } });

        return result;
    }

    async findByUserId(userId: string): Promise<UserSession[]> {
        const userSessions = await this.userSessionRepository.find({ where: { userId } });

        const result = userSessions.map(async (userSession) => {
            if (
                await this.jwtService.verifyAsync(userSession.refreshToken, {
                    secret: env.String('JWT_REFRESH_SECRET'),
                })
            ) {
                return userSession;
            }
        });

        return Promise.all(result).then((values) => values.filter((value) => value !== undefined));
    }

    async update(data: UpdateUserSessionInput): Promise<UpdateResult> {
        const newRefreshToken = { id: data.id, refreshToken: data.refreshToken };

        const result = await this.userSessionRepository.update({ userId: data.userId, refreshToken: data.oldRefreshToken }, newRefreshToken);

        return result;
    }

    async delete(data: DeleteUserSessionInput): Promise<boolean> {
        const refreshToken = await this.findOneByRefreshTokenAndUserId(data.userId, data.refreshToken);

        if (!refreshToken) throw new BadRequestException('User has logged out');

        const result = await this.userSessionRepository.delete({ id: data.id, userId: data.userId, refreshToken: data.refreshToken });

        return result.affected > 0;
    }

    async deleteAllByUserId(userId: string): Promise<void> {
        try {
            await this.getRepository().delete({ userId: userId });
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }
}
