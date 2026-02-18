import ms, { type StringValue } from "ms";
import type {
  TokenProvider,
  TransactionManager
} from "@/application/interfaces/providers";
import { RefreshToken } from "@/domain/entities";
import {
  TokenExpiredError,
  TokenInvalidError,
  TokenRevokedError
} from "@/domain/errors";
import type { RefreshTokensDTO, RefreshTokensResultDTO } from "@repo/dtos";
import { Token } from "@/domain/value-objects";

export type RefreshTokensConfig = {
  accessTokenExpiresIn: StringValue;
  refreshTokenExpiresIn: StringValue;
};

export class RefreshTokens {
  constructor(
    private readonly tokenProvider: TokenProvider,
    private readonly transactionManager: TransactionManager,
    private readonly config: RefreshTokensConfig
  ) {}

  async execute(input: RefreshTokensDTO): Promise<RefreshTokensResultDTO> {
    return this.transactionManager.execute(async (repos) => {
      const token = Token.create(input.refreshToken);
      const refreshToken =
        await repos.refreshTokenRepository.findByToken(token);

      if (!refreshToken) {
        throw new TokenInvalidError();
      }

      if (refreshToken.isRevoked()) {
        throw new TokenRevokedError();
      }

      if (refreshToken.isExpired()) {
        throw new TokenExpiredError();
      }

      const revokedRefreshToken = refreshToken.revoke();

      const accessToken = await this.tokenProvider.generate(
        { userId: refreshToken.userId.toString() },
        this.config.accessTokenExpiresIn
      );

      const newRefreshToken = RefreshToken.create({
        userId: refreshToken.userId,
        expiresIn: this.config.refreshTokenExpiresIn
      });

      await repos.refreshTokenRepository.updateByToken(token, {
        revokedAt: revokedRefreshToken.revokedAt
      });
      await repos.refreshTokenRepository.create(newRefreshToken);
      await repos.refreshTokenRepository.deleteExpired();

      return {
        accessToken,
        refreshToken: newRefreshToken.token.toString(),
        expiresIn: ms(this.config.accessTokenExpiresIn) / 1000
      };
    });
  }
}
