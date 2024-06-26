import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UsersService } from '../../modules/users/users.service';
import { RoleType } from '../constants/index';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private usersService: UsersService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // get route required roles
        const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
            // if handler doesn't have metadata -> get metadata of class
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const userId = context.switchToHttp().getRequest().user.sub;

        const currentUser = await this.usersService.findOne(userId);

        return requiredRoles.includes(currentUser.role.value as RoleType);
    }
}
