import { RequestPasswordReset } from "@/application/use-cases/auth/request-password-reset.use-case";
import { Uuid } from "@/domain/value-objects";
import { makeAuthDeps } from "../../../../factories";

describe("RequestPasswordReset", () => {
  const { mockRepos, transactionManager, config } = makeAuthDeps();

  const useCase = new RequestPasswordReset(transactionManager as any, config);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates reset token and outbox event when user exists", async () => {
    const userId = Uuid.generate();
    mockRepos.userRepository.existsByEmail.mockResolvedValue(userId);
    mockRepos.passwordResetTokenRepository.deleteByUserId.mockResolvedValue(
      undefined
    );
    mockRepos.passwordResetTokenRepository.create.mockResolvedValue(null);
    mockRepos.outboxEventRepository.create.mockResolvedValue(undefined);

    await useCase.execute({ email: "test@example.com" });

    expect(mockRepos.passwordResetTokenRepository.create).toHaveBeenCalled();
    expect(mockRepos.outboxEventRepository.create).toHaveBeenCalled();
  });

  it("does nothing when user does not exist", async () => {
    mockRepos.userRepository.existsByEmail.mockResolvedValue(null);

    await useCase.execute({ email: "nobody@example.com" });

    expect(
      mockRepos.passwordResetTokenRepository.create
    ).not.toHaveBeenCalled();
    expect(mockRepos.outboxEventRepository.create).not.toHaveBeenCalled();
  });
});
