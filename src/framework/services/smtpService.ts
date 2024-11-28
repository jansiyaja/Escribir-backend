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

    async sendEmail({ from, to, subject, text='', html=' ' }: { from: string; to: string; subject: string; text?: string,html?:string }): Promise<void> {
         
         
        try {
            await this.transporter.sendMail({
                from,
                to,
                subject,
                text,
                html
            });
            
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error(`Failed to send email: `);
        }
    }
}
