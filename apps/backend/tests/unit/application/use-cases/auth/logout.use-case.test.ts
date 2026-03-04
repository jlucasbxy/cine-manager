import { Logout } from "@/application/use-cases/auth/logout.use-case";

describe("Logout", () => {
  const refreshTokenRepository = {
    updateByToken: vi.fn()
  };
  const useCase = new Logout(refreshTokenRepository as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("revokes the refresh token", async () => {
    refreshTokenRepository.updateByToken.mockResolvedValue(null);
    const validHex = "a".repeat(64);

    await useCase.execute({ refreshToken: validHex });

    expect(refreshTokenRepository.updateByToken).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ revokedAt: expect.any(Date) })
    );
  });
});
