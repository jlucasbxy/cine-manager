import { RequestPasswordReset } from "@/application/use-cases/auth/request-password-reset.use-case";
import { Uuid } from "@/domain/value-objects";
import { makeAuthDeps } from "../../../../factories";

describe("RequestPasswordReset", () => {
  const { mockRepos, transactionManager, config } = makeAuthDeps();

  const useCase = new RequestPasswordReset(
    transactionManager as unknown as ConstructorParameters<
      typeof RequestPasswordReset
    >[0],
    config
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates reset token and enqueues reset email when user exists", async () => {
    const userId = Uuid.generate();
    mockRepos.userRepository.existsByEmail.mockResolvedValue(userId);
    mockRepos.passwordResetTokenRepository.deleteByUserId.mockResolvedValue(
      undefined
    );
    mockRepos.passwordResetTokenRepository.create.mockResolvedValue(null);
    mockRepos.queue.send.mockResolvedValue(undefined);

    await useCase.execute({ email: "test@example.com" });

    expect(mockRepos.passwordResetTokenRepository.create).toHaveBeenCalled();
    expect(mockRepos.queue.send).toHaveBeenCalledWith(
      "password-reset-email",
      expect.objectContaining({ to: "test@example.com" })
    );
  });

  it("does nothing when user does not exist", async () => {
    mockRepos.userRepository.existsByEmail.mockResolvedValue(null);

    await useCase.execute({ email: "nobody@example.com" });

    expect(
      mockRepos.passwordResetTokenRepository.create
    ).not.toHaveBeenCalled();
    expect(mockRepos.queue.send).not.toHaveBeenCalled();
  });
});
