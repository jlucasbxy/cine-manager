import { Login } from "@/application/use-cases/auth/login.use-case";
import { InvalidCredentialsError } from "@/domain/errors";
import { makeAuthDeps, makeUser } from "../../../../factories";

describe("Login", () => {
  const { mockRepos, transactionManager, hashProvider, tokenProvider, config } =
    makeAuthDeps();

  const useCase = new Login(
    transactionManager as any,
    hashProvider,
    tokenProvider,
    config
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns access token and refresh token on success", async () => {
    const user = makeUser({
      email: "john@example.com",
      password: "hashed-password"
    });

    mockRepos.userRepository.findByEmail.mockResolvedValue(user);
    hashProvider.compare.mockResolvedValue(true);
    tokenProvider.generate.mockResolvedValue("access-token-123");
    mockRepos.refreshTokenRepository.create.mockResolvedValue(null);

    const result = await useCase.execute({
      email: "john@example.com",
      password: "ValidPass1"
    });

    expect(result.accessToken).toBe("access-token-123");
    expect(result.refreshToken).toBeTruthy();
    expect(result.expiresIn).toBe(900);
    expect(mockRepos.userRepository.findByEmail).toHaveBeenCalled();
    expect(hashProvider.compare).toHaveBeenCalledWith({
      plaintext: "ValidPass1",
      hash: "hashed-password"
    });
  });

  it("throws InvalidCredentialsError when user not found", async () => {
    mockRepos.userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: "nobody@example.com", password: "ValidPass1" })
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it("throws InvalidCredentialsError when password is invalid", async () => {
    const user = makeUser({ email: "john@example.com", password: "hashed" });

    mockRepos.userRepository.findByEmail.mockResolvedValue(user);
    hashProvider.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({ email: "john@example.com", password: "WrongPass1" })
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
