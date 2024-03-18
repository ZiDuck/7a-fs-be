import { UseGuards, applyDecorators } from '@nestjs/common';
import { RefreshAuth } from '../guards/refresh-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export function UseAccessRefreshGuard() {
    return applyDecorators(UseGuards(JwtAuthGuard, RefreshAuth));
}
