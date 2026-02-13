import type { EmailProvider } from "@/application/interfaces/providers";
import type { SendPasswordResetEmailData } from "@/application/interfaces/services";

export class SendPasswordResetEmail {
  constructor(private readonly emailProvider: EmailProvider) {}

  async executeBatch(data: SendPasswordResetEmailData[]): Promise<void> {
    await this.emailProvider.sendBatch(
      data.map(({ to, token }) => ({
        to,
        subject: "Password Reset Request",
        body: `Your password reset token is: ${token}`
      }))
    );
  }
}
