import { ValidateToken } from "@/application/use-cases/auth/validate-token.use-case";

describe("ValidateToken", () => {
  const tokenProvider = {
    generate: vi.fn(),
    verify: vi.fn()
  };
  const useCase = new ValidateToken(tokenProvider);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns valid=true with userId on valid token", async () => {
    tokenProvider.verify.mockResolvedValue({ userId: "user-123" });

    const result = await useCase.execute({ token: "valid-token" });

    expect(result).toEqual({ valid: true, userId: "user-123" });
  });

  it("returns valid=false on invalid token", async () => {
    tokenProvider.verify.mockRejectedValue(new Error("invalid"));

    const result = await useCase.execute({ token: "invalid-token" });

    expect(result).toEqual({ valid: false, userId: "" });
  });
});
