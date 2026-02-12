import type {
  PasswordResetTokenRepository,
} from "@/application/interfaces/repositories";
import type {
  HashProvider,
  TransactionManager
} from "@/application/interfaces/providers";
import { Password } from "@/domain/value-objects";
import {
  ResetTokenExpiredError,
  ResetTokenInvalidError,
} from "@/domain/errors";
import type { ResetPasswordDTO } from "@repo/dtos";

export class ResetPassword {
  constructor(
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    private readonly hashProvider: HashProvider,
    private readonly transactionManager: TransactionManager
  ) { }

  async execute(input: ResetPasswordDTO): Promise<void> {
    const token = await this.passwordResetTokenRepository.findByToken(
      input.token
    );

    if (!token) {
      throw new ResetTokenInvalidError();
    }

    if (token.isUsed()) {
      throw new ResetTokenInvalidError();
    }

    if (token.isExpired()) {
      throw new ResetTokenExpiredError();
    }

    const password = Password.create(input.newPassword);
    const hashedPassword = await this.hashProvider.hash(password.toString());
    const usedToken = token.markAsUsed();

    await this.transactionManager.execute(async (repos) => {
      await repos.userRepository.updatePassword(
        token.userId,
        Password.reconstitute(hashedPassword)
      );

      await repos.passwordResetTokenRepository.markAsUsed(usedToken);

      await repos.refreshTokenRepository.revokeAllByUserId(token.userId);
    });
  }
}
