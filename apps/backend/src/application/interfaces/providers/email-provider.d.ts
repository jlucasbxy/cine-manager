export type SendEmailData = {
  to: string;
  subject: string;
  body: string;
  idempotencyKey?: string;
};

export interface EmailProvider {
  send(data: SendEmailData): Promise<void>;
  sendBatch(data: SendEmailData[], idempotencyKey?: string): Promise<void>;
}
