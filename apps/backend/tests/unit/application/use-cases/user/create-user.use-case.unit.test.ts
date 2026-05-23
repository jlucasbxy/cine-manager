import { CreateUser } from "@/application/use-cases/user/create-user.use-case";
import { EmailAlreadyInUseError } from "@/domain/errors";
import { makeAuthDeps, makeUser } from "../../../../factories";

describe("CreateUser", () => {
  const { mockRepos, transactionManager, hashProvider } = makeAuthDeps();

  const useCase = new CreateUser(
    hashProvider,
    transactionManager as unknown as ConstructorParameters<typeof CreateUser>[1]
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates user and returns DTO", async () => {
    hashProvider.hash.mockResolvedValue("hashed-password");
    const savedUser = makeUser({
      name: "John",
      email: "john@example.com",
      password: "hashed-password"
    });
    mockRepos.userRepository.create.mockResolvedValue(savedUser);
    mockRepos.queue.send.mockResolvedValue(undefined);

    const result = await useCase.execute({
      name: "John",
      email: "john@example.com",
      password: "ValidPass1"
    });

    expect(result.name).toBe("John");
    expect(result.email).toBe("john@example.com");
    expect(hashProvider.hash).toHaveBeenCalled();
    expect(mockRepos.queue.send).toHaveBeenCalledWith("welcome-email", {
      to: "john@example.com"
    });
  });

  it("throws EmailAlreadyInUseError when user save returns null", async () => {
    hashProvider.hash.mockResolvedValue("hashed");
    mockRepos.userRepository.create.mockResolvedValue(null);

    await expect(
      useCase.execute({
        name: "John",
        email: "john@example.com",
        password: "ValidPass1"
      })
    ).rejects.toThrow(EmailAlreadyInUseError);
  });
});
