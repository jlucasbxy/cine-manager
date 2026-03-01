import { UpdateUser } from "@/application/use-cases/user/update-user.use-case";
import { UserNotFoundError } from "@/domain/errors";
import { Email, Password, Uuid } from "@/domain/value-objects";
import { User } from "@/domain/entities/user.entity";

describe("UpdateUser", () => {
  const mockRepos = {
    userRepository: {
      findByIdForUpdate: vi.fn(),
      update: vi.fn()
    },
    outboxEventRepository: { create: vi.fn() }
  };
  const transactionManager = {
    execute: vi.fn((fn: any) => fn(mockRepos))
  };
  const hashProvider = {
    hash: vi.fn(),
    compare: vi.fn()
  };

  const useCase = new UpdateUser(hashProvider, transactionManager as any);
  const userId = Uuid.generate();

  function makeUser(avatarUrl?: string) {
    return User.reconstitute({
      id: userId,
      name: "John",
      email: Email.reconstitute("john@example.com"),
      password: Password.reconstitute("hashed"),
      avatarUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates user name and returns DTO", async () => {
    const current = makeUser();
    const updated = makeUser();
    mockRepos.userRepository.findByIdForUpdate.mockResolvedValue(current);
    mockRepos.userRepository.update.mockResolvedValue(updated);

    const result = await useCase.execute(userId.toString(), { name: "Jane" });

    expect(result.name).toBe("John");
    expect(mockRepos.userRepository.update).toHaveBeenCalled();
  });

  it("hashes password when provided", async () => {
    const current = makeUser();
    const updated = makeUser();
    hashProvider.hash.mockResolvedValue("new-hashed");
    mockRepos.userRepository.findByIdForUpdate.mockResolvedValue(current);
    mockRepos.userRepository.update.mockResolvedValue(updated);

    await useCase.execute(userId.toString(), { password: "NewValidPass1" });

    expect(hashProvider.hash).toHaveBeenCalled();
  });

  it("creates outbox event when avatar changes and old avatar exists", async () => {
    const current = makeUser("https://cdn.example.com/uploads/old-avatar.png");
    const updated = makeUser("https://cdn.example.com/uploads/new-avatar.png");
    mockRepos.userRepository.findByIdForUpdate.mockResolvedValue(current);
    mockRepos.userRepository.update.mockResolvedValue(updated);
    mockRepos.outboxEventRepository.create.mockResolvedValue(undefined);

    await useCase.execute(userId.toString(), {
      avatarUrl: "https://cdn.example.com/uploads/new-avatar.png"
    });

    expect(mockRepos.outboxEventRepository.create).toHaveBeenCalled();
  });

  it("throws UserNotFoundError when user not found for update", async () => {
    mockRepos.userRepository.findByIdForUpdate.mockResolvedValue(null);

    await expect(
      useCase.execute(userId.toString(), { name: "Jane" })
    ).rejects.toThrow(UserNotFoundError);
  });

  it("throws UserNotFoundError when update returns null", async () => {
    const current = makeUser();
    mockRepos.userRepository.findByIdForUpdate.mockResolvedValue(current);
    mockRepos.userRepository.update.mockResolvedValue(null);

    await expect(
      useCase.execute(userId.toString(), { name: "Jane" })
    ).rejects.toThrow(UserNotFoundError);
  });
});
