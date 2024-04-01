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
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { UploadFileModule } from './modules/upload-file/upload-file.module';
import { ImagesModule } from './modules/images/images.module';
import { ValidatorModule } from './common/validator/validator.module';
import { FormsModule } from './modules/forms/forms.module';
import { FormQuestionsModule } from './modules/form-questions/form-questions.module';
import { SingleQuestionsModule } from './modules/single-questions/single-questions.module';
import { GroupQuestionsModule } from './modules/group-questions/group-questions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

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
        CloudinaryModule,
        UploadFileModule,
        ImagesModule,
        ValidatorModule,
        FormsModule,
        FormQuestionsModule,
        SingleQuestionsModule,
        GroupQuestionsModule,
        NotificationsModule,
        EventEmitterModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
