import type { EmailProvider } from "@/application/interfaces/providers";
import type { SendPasswordResetEmailData } from "@/application/interfaces/services";

export class SendPasswordResetEmail {
  constructor(private readonly emailProvider: EmailProvider) {}

  async execute({
    to,
    token,
    idempotencyKey
  }: SendPasswordResetEmailData): Promise<void> {
    await this.emailProvider.send({
      to,
      subject: "Password Reset Request",
      body: `Your password reset token is: ${token}`,
      idempotencyKey
    });
  }
}
