import type {
  HashProvider,
  TransactionManager
} from "@/application/interfaces/providers";
import { Password, Token } from "@/domain/value-objects";
import {
  ResetTokenExpiredError,
  ResetTokenInvalidError
} from "@/domain/errors";
import type { ResetPasswordDTO } from "@repo/dtos";

export class ResetPassword {
  constructor(
    private readonly hashProvider: HashProvider,
    private readonly transactionManager: TransactionManager
  ) {}

  async execute(input: ResetPasswordDTO): Promise<void> {
    await this.transactionManager.execute(async (repos) => {
      const token = await repos.passwordResetTokenRepository.findByToken(
        Token.create(input.token)
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

      await repos.userRepository.updateById(token.userId, {
        password: Password.reconstitute(hashedPassword),
        updatedAt: new Date()
      });

      await repos.passwordResetTokenRepository.update(usedToken);

      await repos.refreshTokenRepository.updateManyByUserId(token.userId, {
        revokedAt: new Date()
      });
    });
  }
}
