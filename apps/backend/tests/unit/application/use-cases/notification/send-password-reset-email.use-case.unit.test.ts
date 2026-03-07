import { SendPasswordResetEmail } from "@/application/use-cases/notification/send-password-reset-email.use-case";

vi.mock("@/infrastructure/config/env.config", () => ({
  env: { FRONTEND_URL: "https://example.com" }
}));

describe("SendPasswordResetEmail", () => {
  const emailProvider = { send: vi.fn() };
  const useCase = new SendPasswordResetEmail(
    emailProvider as unknown as ConstructorParameters<
      typeof SendPasswordResetEmail
    >[0]
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends password reset email with correct URL", async () => {
    emailProvider.send.mockResolvedValue(undefined);

    await useCase.execute({
      to: "test@example.com",
      token: "reset-token-123",
      idempotencyKey: "key-456"
    });

    expect(emailProvider.send).toHaveBeenCalledWith({
      to: "test@example.com",
      subject: "Password Reset Request",
      body: expect.stringContaining(
        "https://example.com/password-reset?token=reset-token-123"
      ),
      idempotencyKey: "key-456"
    });
  });
});
