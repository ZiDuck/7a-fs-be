import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export function UseRoleGuard() {
    return applyDecorators(ApiBearerAuth, UseGuards(JwtAuthGuard, RolesGuard));
}
