import { CreateUser } from "@/application/use-cases/user/create-user.use-case";
import { EmailAlreadyInUseError } from "@/domain/errors";
import { Email, Password, Uuid } from "@/domain/value-objects";
import { User } from "@/domain/entities/user.entity";

describe("CreateUser", () => {
  const mockRepos = {
    userRepository: { create: vi.fn() },
    outboxEventRepository: { create: vi.fn() }
  };
  const transactionManager = {
    execute: vi.fn((fn: any) => fn(mockRepos))
  };
  const hashProvider = {
    hash: vi.fn(),
    compare: vi.fn()
  };

  const useCase = new CreateUser(hashProvider, transactionManager as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates user and returns DTO", async () => {
    hashProvider.hash.mockResolvedValue("hashed-password");
    const savedUser = User.reconstitute({
      id: Uuid.generate(),
      name: "John",
      email: Email.reconstitute("john@example.com"),
      password: Password.reconstitute("hashed-password"),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    mockRepos.userRepository.create.mockResolvedValue(savedUser);
    mockRepos.outboxEventRepository.create.mockResolvedValue(undefined);

    const result = await useCase.execute({
      name: "John",
      email: "john@example.com",
      password: "ValidPass1"
    });

    expect(result.name).toBe("John");
    expect(result.email).toBe("john@example.com");
    expect(hashProvider.hash).toHaveBeenCalled();
    expect(mockRepos.outboxEventRepository.create).toHaveBeenCalled();
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
