import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { GetRoleDto } from './dto/get-role.dto';
import { plainToInstance } from 'class-transformer';
import { AdminRole } from '../../cores/decorators/role.decorator';

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
