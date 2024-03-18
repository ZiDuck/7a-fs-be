import { SetMetadata, applyDecorators } from '@nestjs/common';
import { RoleType } from './../constants/index';
import { UseRoleGuard } from './use-role.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleType[]) => applyDecorators(ApiBearerAuth(), UseRoleGuard(), SetMetadata(ROLES_KEY, roles));
export const AdminRole = () => Roles(RoleType.ADMIN);
export const AdminUserRole = () => Roles(RoleType.USER, RoleType.ADMIN);
