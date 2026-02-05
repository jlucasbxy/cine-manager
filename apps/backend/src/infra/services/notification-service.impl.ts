import type { EmailProvider } from "@/application/interfaces/providers";
import type { NotificationService, SendPasswordResetEmailData } from "@/application/interfaces/services";

export class NotificationServiceImpl implements NotificationService {
  constructor(private readonly emailProvider: EmailProvider) {}

  async sendPasswordResetEmail({ to, token }: SendPasswordResetEmailData): Promise<void> {
    await this.emailProvider.send({
      to,
      subject: "Password Reset Request",
      body: `Your password reset token is: ${token}`
    });
  }
}
