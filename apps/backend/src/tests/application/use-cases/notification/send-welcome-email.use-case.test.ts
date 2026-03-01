import { SendWelcomeEmail } from "@/application/use-cases/notification/send-welcome-email.use-case";

describe("SendWelcomeEmail", () => {
  const emailProvider = { send: vi.fn() };
  const useCase = new SendWelcomeEmail(emailProvider as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends welcome email", async () => {
    emailProvider.send.mockResolvedValue(undefined);

    await useCase.execute({
      to: "test@example.com",
      idempotencyKey: "key-123"
    });

    expect(emailProvider.send).toHaveBeenCalledWith({
      to: "test@example.com",
      subject: "Welcome to Movies Manager!",
      body: expect.stringContaining("Welcome"),
      idempotencyKey: "key-123"
    });
  });
});
