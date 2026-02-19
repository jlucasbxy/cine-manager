import type { EmailProvider } from "@/application/interfaces/providers";
import type { SendWelcomeEmailData } from "@/application/interfaces/services";

export class SendWelcomeEmail {
  constructor(private readonly emailProvider: EmailProvider) {}

  async execute({ to, idempotencyKey }: SendWelcomeEmailData): Promise<void> {
    await this.emailProvider.send({
      to,
      subject: "Welcome to Movies Manager!",
      body: `<p>Welcome! Your account has been created successfully. Start adding your favorite movies now.</p>`,
      idempotencyKey
    });
  }
}
