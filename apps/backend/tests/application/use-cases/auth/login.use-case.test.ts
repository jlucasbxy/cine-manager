import { Login } from "@/application/use-cases/auth/login.use-case";
import { InvalidCredentialsError } from "@/domain/errors";
import { Email, Password, Uuid } from "@/domain/value-objects";
import { User } from "@/domain/entities/user.entity";

describe("Login", () => {
  const mockRepos = {
    userRepository: { findByEmail: vi.fn() },
    refreshTokenRepository: { create: vi.fn() }
  };
  const transactionManager = {
    execute: vi.fn((fn: any) => fn(mockRepos))
  };
  const hashProvider = {
    hash: vi.fn(),
    compare: vi.fn()
  };
  const tokenProvider = {
    generate: vi.fn(),
    verify: vi.fn()
  };
  const config = {
    accessTokenExpiresIn: "15m" as const,
    refreshTokenExpiresIn: "7d" as const
  };

  const useCase = new Login(transactionManager as any, hashProvider, tokenProvider, config);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns access token and refresh token on success", async () => {
    const user = User.reconstitute({
      id: Uuid.generate(),
      name: "John",
      email: Email.reconstitute("john@example.com"),
      password: Password.reconstitute("hashed-password"),
      createdAt: new Date(),
      updatedAt: new Date()
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
    const user = User.reconstitute({
      id: Uuid.generate(),
      name: "John",
      email: Email.reconstitute("john@example.com"),
      password: Password.reconstitute("hashed"),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    mockRepos.userRepository.findByEmail.mockResolvedValue(user);
    hashProvider.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({ email: "john@example.com", password: "WrongPass1" })
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
