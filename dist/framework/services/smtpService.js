"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMTPService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class SMTPService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_EMAIL,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    async sendEmail({ from, to, subject, text = '', html = ' ' }) {
        try {
            await this.transporter.sendMail({
                from,
                to,
                subject,
                text,
                html
            });
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw new Error(`Failed to send email: `);
        }
    }
}
exports.SMTPService = SMTPService;
