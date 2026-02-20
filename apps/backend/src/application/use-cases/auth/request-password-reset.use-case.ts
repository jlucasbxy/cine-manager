import type { RequestPasswordResetDTO } from "@repo/dtos";
import type { StringValue } from "ms";
import type { TransactionManager } from "@/application/interfaces/providers";
import { OutboxEvent, PasswordResetToken } from "@/domain/entities";
import { OutboxEventTypeEnum } from "@/domain/enums";
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

      const outboxEntry = OutboxEvent.create({
        type: OutboxEventTypeEnum.PASSWORD_RESET_EMAIL,
        payload: {
          to: email.toString(),
          token: resetToken.token.toString()
        }
      });

      await repos.passwordResetTokenRepository.deleteByUserId(userId);
      await repos.passwordResetTokenRepository.create(resetToken);
      await repos.outboxEventRepository.create(outboxEntry);
    });
  }
}
