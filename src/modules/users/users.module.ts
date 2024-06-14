import { forwardRef, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';
import { UserSessionsModule } from '../user-sessions/user-sessions.module';
import { User } from './entities/user.entity';
import { UserSubscriber } from './subcribers/user.subcriber';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => RolesModule), forwardRef(() => UserSessionsModule), forwardRef(() => AuthModule)],
    controllers: [UsersController],
    providers: [UsersService, UserSubscriber],
    exports: [UsersService],
})
export class UsersModule {}
