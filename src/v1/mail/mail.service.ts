import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface DataSend {
    toEmail: string;
    data: object;
}

@Injectable()
export class MailService {
    private mailFrom: string;
    constructor(
        private configService: ConfigService,
        private mailerService: MailerService,
    ) {
        this.mailFrom = this.configService.get<string>('MAIL_FROM');
    }
    async sendEmailChangeEmailAddressVerifyNewEmail(
        dataSend: DataSend,
    ): Promise<void> {
        try {
            const { toEmail, data } = dataSend;
            await this.mailerService.sendMail({
                to: toEmail,
                from: `XOOX Developer Team <${this.mailFrom}>`,
                subject: 'Verify email address',
                text: 'Verify email address',
                template: 'verify-email-address',
                context: data,
            });
        } catch (error) {
            console.log(error);
        }
    }
}
