import ms, { type StringValue } from "ms";
import type { EmailProvider } from "@/application/interfaces/providers";
import type { UserRepository, PasswordResetTokenRepository } from "@/application/interfaces/repositories";
import { PasswordResetToken } from "@/domain/entities";
import { Email } from "@/domain/value-objects";
import type { RequestPasswordResetDTO } from "@repo/dtos";

export type RequestPasswordResetConfig = {
  passwordResetTokenExpiresIn: StringValue;
};

export class RequestPasswordReset {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    private readonly emailProvider: EmailProvider,
    private readonly config: RequestPasswordResetConfig
  ) {}

  async execute(input: RequestPasswordResetDTO): Promise<void> {
    const email = Email.create(input.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return;
    }

    await this.passwordResetTokenRepository.deleteByUserId(user.id);

    const expiresAt = new Date(
      Date.now() + ms(this.config.passwordResetTokenExpiresIn)
    );

    const resetToken = PasswordResetToken.create({
      userId: user.id,
      expiresAt
    });

    await this.passwordResetTokenRepository.create(resetToken);

    await this.emailProvider.send({
      to: user.email.toString(),
      subject: "Password Reset Request",
      body: `Your password reset token is: ${resetToken.token.toString()}`
    });
  }
}
