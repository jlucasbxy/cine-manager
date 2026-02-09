import type {
  UserRepository,
  PasswordResetTokenRepository,
  RefreshTokenRepository
} from "@/application/interfaces/repositories";
import type { HashProvider } from "@/application/interfaces/providers";
import { Password } from "@/domain/value-objects";
import {
  ResetTokenExpiredError,
  ResetTokenInvalidError,
  UserNotFoundError
} from "@/domain/errors";
import type { ResetPasswordDTO } from "@repo/dtos";

export class ResetPassword {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly hashProvider: HashProvider
  ) {}

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

    const user = await this.userRepository.findById(token.userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    const password = Password.create(input.newPassword);
    const hashedPassword = await this.hashProvider.hash(password.toString());

    await this.userRepository.updatePassword(
      user.id,
      Password.fromHash(hashedPassword)
    );

    const usedToken = token.markAsUsed();
    await this.passwordResetTokenRepository.markAsUsed(usedToken);

    await this.refreshTokenRepository.revokeAllByUserId(user.id);
  }
}
