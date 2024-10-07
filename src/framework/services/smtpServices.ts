import nodemailer, { Transporter } from 'nodemailer';
import { IEmailService } from '../../interfaces/repositories/IEmailRepository';
import dotenv from 'dotenv';
dotenv.config()

export class SMTPService implements IEmailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_EMAIL,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendEmail({ to, subject, text }: { to: string; subject: string; text: string }): Promise<void> {
         
         
        try {
            await this.transporter.sendMail({
                from: process.env.MAIL_EMAIL,
                to,
                subject,
                text,
            });
            
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error(`Failed to send email: `);
        }
    }
}
