export type SendEmailData = {
  to: string;
  subject: string;
  body: string;
};

export interface EmailService {
  send(data: SendEmailData): Promise<void>;
}
