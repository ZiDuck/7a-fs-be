import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { env } from '../../cores/utils/env.util';

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation() {
        const url = `${env.String('MAIL_HOST')}/email/confirm`;

        await this.mailerService.sendMail({
            // to: user.email,
            to: 'haidangtr1501@gmail.com',
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Welcome to Nice App! Confirm your Email',
            template: './confirmation', // `.hbs` extension is appended automatically
            context: {
                // ✏️ filling curly brackets with content
                // name: `${user.firstName} ${user.lastName}`,
                name: `Hai Dang`,
                url: 'haidangtr1501@gmail.com',
            },
            // text: JSON.stringify(user),
            // html: '<h1>Dang</h1></br><p>haidangtr1501@gmail.com</p>',
        });
    }

    async sendUserForgotPassword(email: string, token: string) {
        const resetPasswordLink = `${env.String('FRONT_END_URL')}/reset-password?token=${token}`;
        await this.mailerService.sendMail({
            to: email,
            subject: 'Reset Password',
            template: './forgot-password',
            context: {
                resetPasswordLink,
            },
        });
    }
}
