import type { RequestPasswordResetDTO } from "@repo/dtos";
import type { StringValue } from "ms";
import {
  QueueName,
  type TransactionManager
} from "@/application/interfaces/providers";
import { PasswordResetToken } from "@/domain/entities";
import { Email } from "@/domain/value-objects";

export type RequestPasswordResetConfig = {
  passwordResetTokenExpiresIn: StringValue;
};

export class RequestPasswordReset {
  constructor(
    private readonly transactionManager: TransactionManager,
    private readonly config: RequestPasswordResetConfig
  ) {}

  async execute(input: RequestPasswordResetDTO): Promise<void> {
    const email = Email.create(input.email);

    await this.transactionManager.execute(async (repos) => {
      const userId = await repos.userRepository.existsByEmail(email);

      if (!userId) {
        return;
      }

      const resetToken = PasswordResetToken.create({
        userId,
        expiresIn: this.config.passwordResetTokenExpiresIn
      });

      await repos.passwordResetTokenRepository.deleteByUserId(userId);
      await repos.passwordResetTokenRepository.create(resetToken);
      await repos.queue.send(QueueName.PASSWORD_RESET_EMAIL, {
        to: email.toString(),
        token: resetToken.token.toString()
      });
    });
  }
}
