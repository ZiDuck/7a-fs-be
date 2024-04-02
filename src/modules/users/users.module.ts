import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from '../roles/roles.module';
import { UserSessionsModule } from '../user-sessions/user-sessions.module';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { UserSubscriber } from './subcribers/user.subcriber';

@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => RolesModule), forwardRef(() => UserSessionsModule), forwardRef(() => AuthModule)],
    controllers: [UsersController],
    providers: [UsersService, UserSubscriber],
    exports: [UsersService],
})
export class UsersModule {}
