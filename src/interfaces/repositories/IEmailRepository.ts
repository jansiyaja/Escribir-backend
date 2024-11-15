export interface IEmailService {
    sendEmail(email: { from: string; to: string; subject: string; text: string }): Promise<void>;
}
