import { Resend } from "resend";
import type { EmailProvider, SendEmailData } from "@/application/interfaces/providers";
import { env } from "@/infra/config/env";

export class ResendEmailProvider implements EmailProvider {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);
  }

  async send({ to, subject, body }: SendEmailData): Promise<void> {
    await this.resend.emails.send({
      from: env.EMAIL_FROM,
      to,
      subject,
      html: body
    });
  }
}
