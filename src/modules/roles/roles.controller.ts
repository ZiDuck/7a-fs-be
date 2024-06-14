import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { AdminRole } from '../../cores/decorators/role.decorator';
import { GetRoleDto } from './dto/get-role.dto';
import { RolesService } from './roles.service';

@ApiTags('roles')
@AdminRole()
@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) {}

    @Get()
    async findAll(): Promise<GetRoleDto[]> {
        return plainToInstance(GetRoleDto, await this.roleService.findAll());
    }
}
