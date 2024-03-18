import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';
import { RoleNotExistException } from '../../common/exceptions/business.exception';

@Injectable()
export class RolesService {
    constructor(@InjectRepository(Role) private roleRepository: Repository<Role>) {}

    async create(createRoleDto: CreateRoleDto): Promise<Role> {
        const result = this.roleRepository.create(createRoleDto);

        await this.roleRepository.save(result);

        return result;
    }

    async findById(id: string): Promise<Role> {
        const result = await this.roleRepository.findOneBy({ id: id });

        if (!result) throw new RoleNotExistException(id);

        return result;
    }

    async findAll(): Promise<Role[]> {
        const results = await this.roleRepository.find();

        return results;
    }
}
