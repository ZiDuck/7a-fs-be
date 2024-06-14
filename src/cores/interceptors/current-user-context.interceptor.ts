import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import { CurrentUserContext } from '../providers/current-user-context.provider';

@Injectable()
export class CurrentUserContextInterceptor implements NestInterceptor {
    constructor(private readonly currentUserCtx: CurrentUserContext) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const userId = req.user?.sub || null;
        // here we set the intercepted tenantId on context
        this.currentUserCtx.setUserId(userId);
        return next.handle();
    }
}
