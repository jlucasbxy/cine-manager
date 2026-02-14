import { Resend } from "resend";
import type {
  EmailProvider,
  SendEmailData
} from "@/application/interfaces/providers";
import { env } from "@/infrastructure/config/env.config";

export class ResendEmailProvider implements EmailProvider {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);
  }

  async send({ to, subject, body, idempotencyKey }: SendEmailData): Promise<void> {
    await this.resend.emails.send(
      {
        from: env.EMAIL_FROM,
        to,
        subject,
        html: body
      },
      idempotencyKey ? { idempotencyKey } : undefined
    );
  }

  async sendBatch(emails: SendEmailData[], idempotencyKey?: string): Promise<void> {
    if (emails.length === 0) return;

    await this.resend.batch.send(
      emails.map(({ to, subject, body }) => ({
        from: env.EMAIL_FROM,
        to,
        subject,
        html: body
      })),
      idempotencyKey ? { idempotencyKey } : undefined
    );
  }
}
