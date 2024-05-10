import { applyDecorators, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RefreshAuth } from '../guards/refresh-auth.guard';

export function UseAccessRefreshGuard() {
    return applyDecorators(UseGuards(JwtAuthGuard, RefreshAuth));
}
