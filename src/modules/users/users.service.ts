import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PasswordService } from '../auth/password.service';
import { RolesService } from '../roles/roles.service';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { UserSession } from '../user-sessions/entities/user-session.entity';
import { UserSessionsService } from '../user-sessions/user-sessions.service';
import { UpdateUserInput } from './dto/update-user.input';
import { Role } from '../roles/entities/role.entity';
import { EmailExistException, EmailNotExistException, UserNotExistException } from '../../common/exceptions/business.exception';
import { RoleType, USER_AUDIT } from '../../cores/constants';
import { paginate } from '../../cores/utils/paginate.util';
import { PageDto } from '../../common/dtos/page.dto';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { QueryDto } from '../../common/dtos/query.dto';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private passwordService: PasswordService,
        private rolesService: RolesService,
        private userSessionService: UserSessionsService,
        private readonly cls: ClsService,
    ) {}

    async create(data: CreateUserInput): Promise<boolean> {
        const userExists = await this.usersRepository.findOneBy({ email: data.email });

        if (userExists) throw new EmailExistException(data.email);

        const hashedPassword: string = await this.passwordService.hashPassword(data.password);

        const role: Role = await this.rolesService.findUserRole();

        const user = this.usersRepository.create({ ...data, hashedPassword, role });

        const result = await this.usersRepository.save(user);

        return result ? true : false;
    }

    async findAllPagination(query: PageQueryDto): Promise<PageDto<User>> {
        const builder = this.usersRepository.createQueryBuilder('user').leftJoinAndSelect('user.role', 'role').orderBy('user.createdDate', 'DESC');
        const result = await paginate(builder, query);
        // const results = await this.usersRepository.find({ relations: { role: true } });

        return result;
    }

    async findAllAdmin(): Promise<User[]> {
        const results = await this.usersRepository.find({
            relations: { role: true },
            where: { role: { value: RoleType.ADMIN } },
        });

        return results;
    }

    async findAllUser(): Promise<User[]> {
        const results = await this.usersRepository.find();

        return results;
    }

    // async findAllAdminAndUserRoles(): Promise<User[]> {
    //     const results = await this.usersRepository.find({
    //         relations: { role: true },
    //         where: { role: { value: In[(RoleType.ADMIN, RoleType.USER)] } },
    //     });

    //     return results;
    // }

    async findOneDeleted(id: string): Promise<User> {
        const result = await this.usersRepository.findOne({ where: { id: id }, relations: { role: true }, withDeleted: true });

        if (!result) throw new UserNotExistException(id);

        return result;
    }

    async findAllDeleted(query: PageQueryDto): Promise<PageDto<User>> {
        const builder = this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'role')
            .withDeleted()
            .where('user.deletedDate is not null');

        const result = await paginate(builder, query);

        return result;
    }

    async findOne(id: string): Promise<User> {
        const result = await this.usersRepository.findOne({ where: { id: id }, relations: { role: true } });

        if (!result) throw new UserNotExistException(id);

        return result;
    }

    async findOneByEmail(email: string): Promise<User> {
        const result = await this.usersRepository.findOne({ where: { email: email }, relations: { role: true } });

        if (!result) throw new EmailNotExistException(email);

        return result;
    }

    async findAllByEmail(query: QueryDto): Promise<PageDto<User>> {
        const builder = this.usersRepository.createQueryBuilder('user').leftJoinAndSelect('user.role', 'role');

        if (String(query.isDeleted).toLowerCase() === 'true') {
            builder.withDeleted().andWhere('user.deletedDate is not null');
        }
        builder.andWhere('user.email like :email', { email: `%${query.q}%` });
        const result = await paginate(builder, query);

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

    async update(id: string, data: UpdateUserInput): Promise<boolean> {
        await this.findOne(id);

        const result = await this.usersRepository.update(id, data);

        this.cls.set(USER_AUDIT, id);

        return result.affected ? true : false;
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
        const restoreUser = await this.findOneDeleted(id);

        const result = await this.usersRepository.recover(restoreUser);

        if (!result) throw new InternalServerErrorException();

        return;
    }

    async setPassword(email: string, newPassword: string): Promise<boolean> {
        const hashedPassword: string = await this.passwordService.hashPassword(newPassword);

        await this.usersRepository.update({ email }, { hashedPassword });

        return true;
    }

    async decentralize(userId: string, roleId: string) {
        const user = await this.findOne(userId);

        const role = await this.rolesService.findById(roleId);

        user.role = role;

        await this.usersRepository.save(user);

        return true;
    }
}
