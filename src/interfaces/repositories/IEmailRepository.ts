export interface IEmailService {
    sendEmail(email: { to: string; subject: string; text: string }): Promise<void>;
}
