import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { RoleType } from './../constants/index';
import { UseRoleGuard } from './use-role.decorator';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleType[]) => applyDecorators(ApiBearerAuth(), UseRoleGuard(), SetMetadata(ROLES_KEY, roles));
export const AdminRole = () => Roles(RoleType.ADMIN);
export const AdminUserRole = () => Roles(RoleType.USER, RoleType.ADMIN);
