import { ResetPassword } from "@/application/use-cases/auth/reset-password.use-case";
import { PasswordResetToken } from "@/domain/entities/password-reset-token.entity";
import {
  ResetTokenExpiredError,
  ResetTokenInvalidError
} from "@/domain/errors";
import { Token, Uuid } from "@/domain/value-objects";
import { daysAgo, daysFromNow, makeAuthDeps } from "../../../../factories";

describe("ResetPassword", () => {
  const validHex = "a".repeat(64);
  const { mockRepos, transactionManager, hashProvider } = makeAuthDeps();

  const useCase = new ResetPassword(
    hashProvider,
    transactionManager as unknown as ConstructorParameters<
      typeof ResetPassword
    >[1]
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resets password on valid token", async () => {
    const userId = Uuid.generate();
    const prt = PasswordResetToken.reconstitute({
      id: Uuid.generate(),
      token: Token.create(validHex),
      userId,
      expiresAt: daysFromNow(1),
      usedAt: null,
      createdAt: new Date()
    });

    mockRepos.passwordResetTokenRepository.findByTokenForUpdate.mockResolvedValue(
      prt
    );
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
    expect(
      mockRepos.refreshTokenRepository.updateManyByUserId
    ).toHaveBeenCalled();
  });

  it("throws ResetTokenInvalidError when token not found", async () => {
    mockRepos.passwordResetTokenRepository.findByTokenForUpdate.mockResolvedValue(
      null
    );

    await expect(
      useCase.execute({ token: validHex, newPassword: "NewValidPass1" })
    ).rejects.toThrow(ResetTokenInvalidError);
  });

  it("throws ResetTokenInvalidError when token is used", async () => {
    const prt = PasswordResetToken.reconstitute({
      id: Uuid.generate(),
      token: Token.create(validHex),
      userId: Uuid.generate(),
      expiresAt: daysFromNow(1),
      usedAt: new Date(),
      createdAt: new Date()
    });
    mockRepos.passwordResetTokenRepository.findByTokenForUpdate.mockResolvedValue(
      prt
    );

    await expect(
      useCase.execute({ token: validHex, newPassword: "NewValidPass1" })
    ).rejects.toThrow(ResetTokenInvalidError);
  });

  it("throws ResetTokenExpiredError when token is expired", async () => {
    const prt = PasswordResetToken.reconstitute({
      id: Uuid.generate(),
      token: Token.create(validHex),
      userId: Uuid.generate(),
      expiresAt: daysAgo(1),
      usedAt: null,
      createdAt: new Date()
    });
    mockRepos.passwordResetTokenRepository.findByTokenForUpdate.mockResolvedValue(
      prt
    );

    await expect(
      useCase.execute({ token: validHex, newPassword: "NewValidPass1" })
    ).rejects.toThrow(ResetTokenExpiredError);
  });
});
