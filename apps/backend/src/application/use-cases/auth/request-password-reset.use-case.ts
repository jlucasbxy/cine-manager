import { type StringValue } from "ms";
import type { TransactionManager } from "@/application/interfaces/providers";
import { PasswordResetToken, NotificationOutbox } from "@/domain/entities";
import { NotificationTypeEnum } from "@/domain/enums";
import { Email } from "@/domain/value-objects";
import type { RequestPasswordResetDTO } from "@repo/dtos";

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
      const user = await repos.userRepository.findByEmail(email);

      if (!user) {
        return;
      }

      const resetToken = PasswordResetToken.create({
        userId: user.id,
        expiresIn: this.config.passwordResetTokenExpiresIn
      });

      const outboxEntry = NotificationOutbox.create({
        type: NotificationTypeEnum.PASSWORD_RESET_EMAIL,
        payload: {
          to: user.email.toString(),
          token: resetToken.token.toString()
        }
      });

      await repos.passwordResetTokenRepository.deleteByUserId(user.id);
      await repos.passwordResetTokenRepository.create(resetToken);
      await repos.notificationOutboxRepository.create(outboxEntry);
    });
  }
}
