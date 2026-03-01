import { ResetPassword } from "@/application/use-cases/auth/reset-password.use-case";
import { PasswordResetToken } from "@/domain/entities/password-reset-token.entity";
import {
  ResetTokenExpiredError,
  ResetTokenInvalidError
} from "@/domain/errors";
import { Token, Uuid } from "@/domain/value-objects";

describe("ResetPassword", () => {
  const validHex = "a".repeat(64);
  const mockRepos = {
    passwordResetTokenRepository: {
      findByTokenForUpdate: vi.fn(),
      update: vi.fn()
    },
    userRepository: { update: vi.fn() },
    refreshTokenRepository: { updateManyByUserId: vi.fn() }
  };
  const transactionManager = {
    execute: vi.fn((fn: any) => fn(mockRepos))
  };
  const hashProvider = {
    hash: vi.fn(),
    compare: vi.fn()
  };

  const useCase = new ResetPassword(hashProvider, transactionManager as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resets password on valid token", async () => {
    const userId = Uuid.generate();
    const prt = PasswordResetToken.reconstitute({
      id: Uuid.generate(),
      token: Token.create(validHex),
      userId,
      expiresAt: new Date("2030-01-01"),
      usedAt: null,
      createdAt: new Date()
    });

    mockRepos.passwordResetTokenRepository.findByTokenForUpdate.mockResolvedValue(prt);
    hashProvider.hash.mockResolvedValue("new-hashed-password");
    mockRepos.userRepository.update.mockResolvedValue(null);
    mockRepos.passwordResetTokenRepository.update.mockResolvedValue(undefined);
    mockRepos.refreshTokenRepository.updateManyByUserId.mockResolvedValue(1);

    await useCase.execute({ token: validHex, newPassword: "NewValidPass1" });

    expect(hashProvider.hash).toHaveBeenCalled();
    expect(mockRepos.userRepository.update).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({ password: expect.anything() })
    );
    expect(mockRepos.refreshTokenRepository.updateManyByUserId).toHaveBeenCalled();
  });

  it("throws ResetTokenInvalidError when token not found", async () => {
    mockRepos.passwordResetTokenRepository.findByTokenForUpdate.mockResolvedValue(null);

    await expect(
      useCase.execute({ token: validHex, newPassword: "NewValidPass1" })
    ).rejects.toThrow(ResetTokenInvalidError);
  });

  it("throws ResetTokenInvalidError when token is used", async () => {
    const prt = PasswordResetToken.reconstitute({
      id: Uuid.generate(),
      token: Token.create(validHex),
      userId: Uuid.generate(),
      expiresAt: new Date("2030-01-01"),
      usedAt: new Date(),
      createdAt: new Date()
    });
    mockRepos.passwordResetTokenRepository.findByTokenForUpdate.mockResolvedValue(prt);

    await expect(
      useCase.execute({ token: validHex, newPassword: "NewValidPass1" })
    ).rejects.toThrow(ResetTokenInvalidError);
  });

  it("throws ResetTokenExpiredError when token is expired", async () => {
    const prt = PasswordResetToken.reconstitute({
      id: Uuid.generate(),
      token: Token.create(validHex),
      userId: Uuid.generate(),
      expiresAt: new Date("2020-01-01"),
      usedAt: null,
      createdAt: new Date()
    });
    mockRepos.passwordResetTokenRepository.findByTokenForUpdate.mockResolvedValue(prt);

    await expect(
      useCase.execute({ token: validHex, newPassword: "NewValidPass1" })
    ).rejects.toThrow(ResetTokenExpiredError);
  });
});
