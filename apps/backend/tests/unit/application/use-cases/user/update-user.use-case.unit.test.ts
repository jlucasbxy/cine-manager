import { UpdateUser } from "@/application/use-cases/user/update-user.use-case";
import { UserNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";
import {
  makeAuthDeps,
  makeUser as makeUserFactory
} from "../../../../factories";

describe("UpdateUser", () => {
  const { mockRepos, transactionManager, hashProvider } = makeAuthDeps();

  const useCase = new UpdateUser(
    hashProvider,
    transactionManager as unknown as ConstructorParameters<typeof UpdateUser>[1]
  );
  const userId = Uuid.generate();

  function makeCurrentUser(avatarUrl?: string) {
    return makeUserFactory({
      id: userId,
      name: "John",
      email: "john@example.com",
      password: "hashed",
      avatarUrl
    });
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates user name and returns DTO", async () => {
    const current = makeCurrentUser();
    const updated = makeCurrentUser();
    mockRepos.userRepository.findByIdForUpdate.mockResolvedValue(current);
    mockRepos.userRepository.update.mockResolvedValue(updated);

    const result = await useCase.execute(userId.toString(), { name: "Jane" });

    expect(result.name).toBe("John");
    expect(mockRepos.userRepository.update).toHaveBeenCalled();
  });

  it("hashes password when provided", async () => {
    const current = makeCurrentUser();
    const updated = makeCurrentUser();
    hashProvider.hash.mockResolvedValue("new-hashed");
    mockRepos.userRepository.findByIdForUpdate.mockResolvedValue(current);
    mockRepos.userRepository.update.mockResolvedValue(updated);

    await useCase.execute(userId.toString(), { password: "NewValidPass1" });

    expect(hashProvider.hash).toHaveBeenCalled();
  });

  it("creates outbox event when avatar changes and old avatar exists", async () => {
    const current = makeCurrentUser(
      "https://cdn.example.com/uploads/old-avatar.png"
    );
    const updated = makeCurrentUser(
      "https://cdn.example.com/uploads/new-avatar.png"
    );
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
    const current = makeCurrentUser();
    mockRepos.userRepository.findByIdForUpdate.mockResolvedValue(current);
    mockRepos.userRepository.update.mockResolvedValue(null);

    await expect(
      useCase.execute(userId.toString(), { name: "Jane" })
    ).rejects.toThrow(UserNotFoundError);
  });
});
