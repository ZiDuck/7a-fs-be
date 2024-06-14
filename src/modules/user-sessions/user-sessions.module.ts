import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserSession } from './entities/user-session.entity';
import { UserSessionsController } from './user-sessions.controller';
import { UserSessionsService } from './user-sessions.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserSession]), JwtModule.register({})],
    controllers: [UserSessionsController],
    providers: [UserSessionsService],
    exports: [UserSessionsService],
})
export class UserSessionsModule {}
