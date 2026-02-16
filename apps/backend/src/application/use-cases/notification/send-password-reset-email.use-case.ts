import type { EmailProvider } from "@/application/interfaces/providers";
import type { SendPasswordResetEmailData } from "@/application/interfaces/services";
import { env } from "@/infrastructure/config/env.config";

export class SendPasswordResetEmail {
  constructor(private readonly emailProvider: EmailProvider) {}

  async execute({
    to,
    token,
    idempotencyKey
  }: SendPasswordResetEmailData): Promise<void> {
    const resetUrl = `${env.FRONTEND_URL}/password-reset?token=${encodeURIComponent(token)}`;

    await this.emailProvider.send({
      to,
      subject: "Password Reset Request",
      body: `Click the link below to reset your password:\n\n<a href="${resetUrl}">Reset your password</a>\n\nIf you did not request a password reset, you can ignore this email.`,
      idempotencyKey
    });
  }
}
