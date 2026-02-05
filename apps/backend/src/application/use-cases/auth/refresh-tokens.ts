import ms, { type StringValue } from "ms";
import type { UserRepository, RefreshTokenRepository } from "@/application/interfaces/repositories";
import type { TokenProvider } from "@/application/interfaces/providers";
import { RefreshToken } from "@/domain/entities";
import {
  TokenExpiredError,
  TokenInvalidError,
  TokenRevokedError,
  UserNotFoundError
} from "@/domain/errors";
import type { RefreshTokensDTO, RefreshTokensResultDTO } from "@repo/dtos";

export type RefreshTokensConfig = {
  accessTokenExpiresIn: StringValue;
  refreshTokenExpiresIn: StringValue;
};

export class RefreshTokens {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenProvider: TokenProvider,
    private readonly config: RefreshTokensConfig
  ) {}

  async execute(input: RefreshTokensDTO): Promise<RefreshTokensResultDTO> {
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

    const refreshTokenExpiresAt = new Date(
      Date.now() + ms(this.config.refreshTokenExpiresIn)
    );

    const newRefreshToken = RefreshToken.create({
      userId: user.id,
      expiresAt: refreshTokenExpiresAt
    });

    await this.refreshTokenRepository.create(newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken.token.toString(),
      expiresIn: ms(this.config.accessTokenExpiresIn) / 1000
    };
  }
}
