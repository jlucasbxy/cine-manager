import ms, { type StringValue } from "ms";
import type { UserRepository, PasswordResetTokenRepository } from "@/application/interfaces/repositories";
import type { NotificationService } from "@/application/interfaces/services";
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
    private readonly notificationService: NotificationService,
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

    await this.notificationService.sendPasswordResetEmail({
      to: user.email.toString(),
      token: resetToken.token.toString()
    });
  }
}
