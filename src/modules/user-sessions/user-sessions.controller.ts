import { Controller } from '@nestjs/common';

import { UserSessionsService } from './user-sessions.service';

@Controller('refresh-tokens')
export class UserSessionsController {
    constructor(private readonly refreshTokensService: UserSessionsService) {}
}
