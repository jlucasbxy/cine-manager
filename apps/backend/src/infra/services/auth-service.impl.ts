import crypto from "node:crypto";
import ms, { type StringValue } from "ms";
import type {
  AuthService,
  LoginInput,
  LoginOutput,
  LogoutInput,
  RefreshTokenInput,
  RefreshTokenOutput,
  RequestPasswordResetInput,
  ResetPasswordInput,
  ValidateTokenInput,
  ValidateTokenOutput,
  EmailService
} from "@/application/interfaces/services";
import type {
  UserRepository,
  RefreshTokenRepository,
  PasswordResetTokenRepository
} from "@/application/interfaces/repositories";
import type { HashProvider, TokenProvider } from "@/application/interfaces/providers";
import { RefreshToken, PasswordResetToken } from "@/domain/entities";
import { Email, Password } from "@/domain/value-objects";
import {
  InvalidCredentialsError,
  TokenExpiredError,
  TokenInvalidError,
  TokenRevokedError,
  UserNotFoundError,
  ResetTokenExpiredError,
  ResetTokenInvalidError
} from "@/domain/errors";

export type AuthServiceConfig = {
  accessTokenExpiresIn: StringValue;
  refreshTokenExpiresIn: StringValue;
  passwordResetTokenExpiresIn: StringValue;
};

export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    private readonly hashProvider: HashProvider,
    private readonly tokenProvider: TokenProvider,
    private readonly emailService: EmailService,
    private readonly config: AuthServiceConfig
  ) {}

  async login(input: LoginInput): Promise<LoginOutput> {
    const email = Email.create(input.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.hashProvider.compare({
      plaintext: input.password,
      hash: user.password.toString()
    });

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const accessToken = await this.tokenProvider.generate(
      { userId: user.id.toString() },
      this.config.accessTokenExpiresIn
    );

    const refreshTokenValue = this.generateSecureToken();
    const refreshTokenExpiresAt = new Date(
      Date.now() + ms(this.config.refreshTokenExpiresIn)
    );

    const refreshToken = RefreshToken.create({
      token: refreshTokenValue,
      userId: user.id,
      expiresAt: refreshTokenExpiresAt
    });

    await this.refreshTokenRepository.create(refreshToken);

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      expiresIn: ms(this.config.accessTokenExpiresIn) / 1000
    };
  }

  async logout(input: LogoutInput): Promise<void> {
    const token = await this.refreshTokenRepository.findByToken(input.refreshToken);
    if (token) {
      const revokedToken = token.revoke();
      await this.refreshTokenRepository.revoke(revokedToken);
    }
  }

  async refreshTokens(input: RefreshTokenInput): Promise<RefreshTokenOutput> {
    const token = await this.refreshTokenRepository.findByToken(input.refreshToken);

    if (!token) {
      throw new TokenInvalidError();
    }

    if (token.isRevoked()) {
      throw new TokenRevokedError();
    }

    if (token.isExpired()) {
      throw new TokenExpiredError();
    }

    const user = await this.userRepository.findById(token.userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    const revokedToken = token.revoke();
    await this.refreshTokenRepository.revoke(revokedToken);

    const accessToken = await this.tokenProvider.generate(
      { userId: user.id.toString() },
      this.config.accessTokenExpiresIn
    );

    const newRefreshTokenValue = this.generateSecureToken();
    const refreshTokenExpiresAt = new Date(
      Date.now() + ms(this.config.refreshTokenExpiresIn)
    );

    const newRefreshToken = RefreshToken.create({
      token: newRefreshTokenValue,
      userId: user.id,
      expiresAt: refreshTokenExpiresAt
    });

    await this.refreshTokenRepository.create(newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshTokenValue,
      expiresIn: ms(this.config.accessTokenExpiresIn) / 1000
    };
  }

  async requestPasswordReset(input: RequestPasswordResetInput): Promise<void> {
    const email = Email.create(input.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return;
    }

    await this.passwordResetTokenRepository.deleteByUserId(user.id);

    const resetTokenValue = this.generateSecureToken();
    const expiresAt = new Date(
      Date.now() + ms(this.config.passwordResetTokenExpiresIn)
    );

    const resetToken = PasswordResetToken.create({
      token: resetTokenValue,
      userId: user.id,
      expiresAt
    });

    await this.passwordResetTokenRepository.create(resetToken);

    await this.emailService.send({
      to: user.email.toString(),
      subject: "Password Reset Request",
      body: `Your password reset token is: ${resetTokenValue}`
    });
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const token = await this.passwordResetTokenRepository.findByToken(input.token);

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

    await this.userRepository.updatePassword(user.id, Password.fromHash(hashedPassword));

    const usedToken = token.markAsUsed();
    await this.passwordResetTokenRepository.markAsUsed(usedToken);

    await this.refreshTokenRepository.revokeAllByUserId(user.id);
  }

  async validateToken(input: ValidateTokenInput): Promise<ValidateTokenOutput> {
    try {
      const payload = await this.tokenProvider.verify(input.token);
      return {
        userId: payload.userId,
        valid: true
      };
    } catch {
      return {
        userId: "",
        valid: false
      };
    }
  }

  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }
}
