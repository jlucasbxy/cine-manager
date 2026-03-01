import { RefreshTokens } from "@/application/use-cases/auth/refresh-tokens.use-case";
import { RefreshToken } from "@/domain/entities/refresh-token.entity";
import { TokenInvalidError } from "@/domain/errors";
import { Token, Uuid } from "@/domain/value-objects";

describe("RefreshTokens", () => {
  const mockRepos = {
    refreshTokenRepository: {
      findByTokenForUpdate: vi.fn(),
      updateByToken: vi.fn(),
      create: vi.fn(),
      deleteExpiredByUserId: vi.fn()
    }
  };
  const transactionManager = {
    execute: vi.fn((fn: any) => fn(mockRepos))
  };
  const tokenProvider = {
    generate: vi.fn(),
    verify: vi.fn()
  };
  const config = {
    accessTokenExpiresIn: "15m" as const,
    refreshTokenExpiresIn: "7d" as const
  };

  const useCase = new RefreshTokens(tokenProvider, transactionManager as any, config);
  const validHex = "a".repeat(64);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns new tokens on valid refresh token", async () => {
    const userId = Uuid.generate();
    const rt = RefreshToken.reconstitute({
      id: Uuid.generate(),
      token: Token.create(validHex),
      userId,
      expiresAt: new Date("2030-01-01"),
      revokedAt: null,
      createdAt: new Date()
    });

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
    const rt = RefreshToken.reconstitute({
      id: Uuid.generate(),
      token: Token.create(validHex),
      userId: Uuid.generate(),
      expiresAt: new Date("2030-01-01"),
      revokedAt: new Date(),
      createdAt: new Date()
    });
    mockRepos.refreshTokenRepository.findByTokenForUpdate.mockResolvedValue(rt);

    await expect(
      useCase.execute({ refreshToken: validHex })
    ).rejects.toThrow(TokenInvalidError);
  });

  it("throws TokenInvalidError when token is expired", async () => {
    const rt = RefreshToken.reconstitute({
      id: Uuid.generate(),
      token: Token.create(validHex),
      userId: Uuid.generate(),
      expiresAt: new Date("2020-01-01"),
      revokedAt: null,
      createdAt: new Date()
    });
    mockRepos.refreshTokenRepository.findByTokenForUpdate.mockResolvedValue(rt);

    await expect(
      useCase.execute({ refreshToken: validHex })
    ).rejects.toThrow(TokenInvalidError);
  });
});
