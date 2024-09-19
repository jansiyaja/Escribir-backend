import nodemailer, { Transporter } from 'nodemailer';
import { IEmailService } from '../../interfaces/repositories/IEmailRepository';

export class SMTPService implements IEmailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_EMAIL,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendEmail({ to, subject, text }: { to: string; subject: string; text: string }): Promise<void> {
        await this.transporter.sendMail({
            from: process.env.MAIL_EMAIL,
            to,
            subject,
            text,
        });
    }
}
