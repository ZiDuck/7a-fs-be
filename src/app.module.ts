import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ClsModule } from 'nestjs-cls';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ValidatorModule } from './common/validator/validator.module';
import { CoreModule } from './cores/core.module';
import { DatabaseModule } from './cores/database/database.module';
import { CurrentUserContextInterceptor } from './cores/interceptors/current-user-context.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { BackupModule } from './modules/backup/backup.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { EmailModule } from './modules/email/email.module';
import { FileHistoryModule } from './modules/file-history/file-history.module';
import { FormTemplatesModule } from './modules/form_templates/form_templates.module';
import { FormQuestionsModule } from './modules/form-questions/form-questions.module';
import { FormSubmitsModule } from './modules/form-submits/form-submits.module';
import { FormSummaryModule } from './modules/form-summary/form-summary.module';
import { FormsModule } from './modules/forms/forms.module';
import { GroupQuestionsModule } from './modules/group-questions/group-questions.module';
import { ImageHistoryModule } from './modules/image-history/image-history.module';
import { ImagesModule } from './modules/images/images.module';
import { MinioClientModule } from './modules/minio-client/minio-client.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RawFilesModule } from './modules/raw-files/raw-files.module';
import { RolesModule } from './modules/roles/roles.module';
import { SingleQuestionsModule } from './modules/single-questions/single-questions.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UploadFileModule } from './modules/upload-file/upload-file.module';
import { UserSessionsModule } from './modules/user-sessions/user-sessions.module';
import { UsersModule } from './modules/users/users.module';

@Module({
    imports: [
        CoreModule.forRoot({ isGlobal: true }),
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
        FormTemplatesModule,
        BackupModule,
        FormSubmitsModule,
        RawFilesModule,
        ImageHistoryModule,
        FileHistoryModule,
        TasksModule,
        FormSummaryModule,
        MinioClientModule,
        ScheduleModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: CurrentUserContextInterceptor,
        },
        // CurrentUserContext,
    ],
})
export class AppModule {}
