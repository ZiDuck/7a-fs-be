import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { PasswordService } from '../auth/password.service';
import { RolesService } from '../roles/roles.service';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { UserSession } from '../user-sessions/entities/user-session.entity';
import { UserSessionsService } from '../user-sessions/user-sessions.service';
import { UpdateUserInput } from './dto/update-user.input';
import { Role } from '../roles/entities/role.entity';
import { EmailExistException, EmailNotExistException, UserNotExistException } from '../../common/exceptions/business.exception';
import { RoleType } from '../../cores/constants';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private passwordService: PasswordService,
        private rolesService: RolesService,
        private userSessionService: UserSessionsService,
    ) {}

    async create(data: CreateUserInput): Promise<User> {
        let result = await this.usersRepository.findOneBy({ email: data.email });

        if (result) throw new EmailExistException(data.email);

        const hashedPassword: string = await this.passwordService.hashPassword(data.password);

        const role: Role = await this.rolesService.findById(data.roleId);

        result = this.usersRepository.create({ ...data, hashedPassword, role });

        await this.usersRepository.save(result);

        return result;
    }

    async findAll(): Promise<User[]> {
        const results = await this.usersRepository.find({ relations: { role: true } });

        return results;
    }

    async findAllAdmin(): Promise<User[]> {
        const results = await this.usersRepository.find({
            relations: { role: true },
            where: { role: { value: RoleType.ADMIN } },
        });

        return results;
    }

    async findAllAdminAndUserRoles(): Promise<User[]> {
        const results = await this.usersRepository.find({
            relations: { role: true },
            where: { role: { value: In[(RoleType.ADMIN, RoleType.USER)] } },
        });

        return results;
    }

    async findOne(id: string): Promise<User> {
        const result = await this.usersRepository.findOne({ where: { id: id }, relations: { role: true }, withDeleted: true });

        if (!result) throw new UserNotExistException(id);

        return result;
    }

    async findOneByEmail(email: string): Promise<User> {
        const result = await this.usersRepository.findOne({ where: { email: email }, relations: { role: true } });

        if (!result) throw new EmailNotExistException(email);

        return result;
    }

    async findRefreshTokenByUserId(id: string, refreshToken: string, sessionId: string): Promise<User> {
        const result: User = await this.usersRepository.findOne({
            where: { id: id, userSessions: { id: sessionId, userId: id, refreshToken } },
            relations: { role: true, userSessions: true },
        });

        return result;
    }

    async createRefreshToken(id: string, refreshToken: string, userSessionId: string): Promise<UserSession> {
        const result = await this.userSessionService.create({ refreshToken, userId: id, id: userSessionId });

        return result;
    }

    async updateRefreshToken(id: string, oldRefreshToken: string, refreshToken: string, userSessionId: string): Promise<object> {
        const result = await this.userSessionService.update({ userId: id, oldRefreshToken, refreshToken, id: userSessionId });

        return result;
    }

    async update(id: string, data: UpdateUserInput): Promise<User> {
        const result = await this.findOne(id);

        await this.usersRepository.update(result.id, data);

        return await this.findOne(result.id);
    }

    async deleteRefreshToken(id: string, refreshToken: string, userSessionId: string): Promise<boolean> {
        const result = await this.userSessionService.delete({ userId: id, refreshToken, id: userSessionId });

        return result;
    }

    async delete(id: string): Promise<void> {
        const deleteUser = await this.findOne(id);

        const result = await this.usersRepository.softRemove(deleteUser);

        if (!result) throw new InternalServerErrorException();

        await this.userSessionService.deleteAllByUserId(id);

        return;
    }

    async restore(id: string): Promise<void> {
        const restoreUser = await this.findOne(id);

        const result = await this.usersRepository.recover(restoreUser);

        if (!result) throw new InternalServerErrorException();

        return;
    }

    async setPassword(email: string, newPassword: string): Promise<boolean> {
        const hashedPassword: string = await this.passwordService.hashPassword(newPassword);

        await this.usersRepository.update({ email }, { hashedPassword });

        return true;
    }
}
