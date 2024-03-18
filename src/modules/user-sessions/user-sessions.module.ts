import { Module } from '@nestjs/common';
import { UserSessionsService } from './user-sessions.service';
import { UserSessionsController } from './user-sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSession } from './entities/user-session.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([UserSession]), JwtModule.register({})],
    controllers: [UserSessionsController],
    providers: [UserSessionsService],
    exports: [UserSessionsService],
})
export class UserSessionsModule {}
