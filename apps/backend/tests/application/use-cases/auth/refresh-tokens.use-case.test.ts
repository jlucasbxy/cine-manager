import { RefreshTokens } from "@/application/use-cases/auth/refresh-tokens.use-case";
import { TokenInvalidError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";
import { makeAuthDeps, makeRefreshToken } from "../../../factories";

describe("RefreshTokens", () => {
  const { mockRepos, transactionManager, tokenProvider, config } = makeAuthDeps();

  const useCase = new RefreshTokens(tokenProvider, transactionManager as any, config);
  const validHex = "a".repeat(64);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns new tokens on valid refresh token", async () => {
    const userId = Uuid.generate();
    const rt = makeRefreshToken({ token: validHex, userId });

    mockRepos.refreshTokenRepository.findByTokenForUpdate.mockResolvedValue(rt);
    mockRepos.refreshTokenRepository.updateByToken.mockResolvedValue(null);
    mockRepos.refreshTokenRepository.create.mockResolvedValue(null);
    mockRepos.refreshTokenRepository.deleteExpiredByUserId.mockResolvedValue(undefined);
    tokenProvider.generate.mockResolvedValue("new-access-token");

    const result = await useCase.execute({ refreshToken: validHex });

    expect(result.accessToken).toBe("new-access-token");
    expect(result.refreshToken).toBeTruthy();
    expect(result.expiresIn).toBe(900);
  });

  it("throws TokenInvalidError when token not found", async () => {
    mockRepos.refreshTokenRepository.findByTokenForUpdate.mockResolvedValue(null);

    await expect(
      useCase.execute({ refreshToken: validHex })
    ).rejects.toThrow(TokenInvalidError);
  });

  it("throws TokenInvalidError when token is revoked", async () => {
    const rt = makeRefreshToken({
      token: validHex,
      revokedAt: new Date("2024-01-01T00:00:00.000Z")
    });
    mockRepos.refreshTokenRepository.findByTokenForUpdate.mockResolvedValue(rt);

    await expect(
      useCase.execute({ refreshToken: validHex })
    ).rejects.toThrow(TokenInvalidError);
  });

  it("throws TokenInvalidError when token is expired", async () => {
    const rt = makeRefreshToken({ token: validHex, expiresAt: new Date("2020-01-01") });
    mockRepos.refreshTokenRepository.findByTokenForUpdate.mockResolvedValue(rt);

    await expect(
      useCase.execute({ refreshToken: validHex })
    ).rejects.toThrow(TokenInvalidError);
  });
});
