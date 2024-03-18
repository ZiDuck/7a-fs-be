import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './cores/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { UserSessionsModule } from './modules/user-sessions/user-sessions.module';
import { EmailModule } from './modules/email/email.module';
import { ClsModule } from 'nestjs-cls';

@Module({
    imports: [
        DatabaseModule,
        UsersModule,
        AuthModule,
        RolesModule,
        UserSessionsModule,
        EmailModule,
        ClsModule.forRoot({
            global: true,
            middleware: {
                // automatically mount the
                // ClsMiddleware for all routes
                mount: true,
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
