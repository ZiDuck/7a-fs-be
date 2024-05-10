import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

import { env } from '../../cores/utils/env.util';
import { EmailService } from './email.service';
@Global()
@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async () => ({
                // transport: config.get("MAIL_TRANSPORT"),
                // or
                transport: {
                    host: env.String('MAIL_HOST'),
                    port: env.Int('MAIL_PORT', 587),
                    secure: false,
                    auth: {
                        user: env.String('MAIL_USER'),
                        pass: env.String('MAIL_PASSWORD'),
                    },
                },
                defaults: {
                    from: `"No Reply" <${env.String('MAIL_FROM')}>`,
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: false,
                    },
                },
            }),
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
