import { GetUser } from "@/application/use-cases/user/get-user.use-case";
import { UserNotFoundError } from "@/domain/errors";
import { Email, Password, Uuid } from "@/domain/value-objects";
import { User } from "@/domain/entities/user.entity";

describe("GetUser", () => {
  const userRepository = {
    findById: vi.fn()
  };
  const useCase = new GetUser(userRepository as any);
  const userId = Uuid.generate();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns user DTO when found", async () => {
    const user = User.reconstitute({
      id: userId,
      name: "John",
      email: Email.reconstitute("john@example.com"),
      password: Password.reconstitute("hashed"),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    userRepository.findById.mockResolvedValue(user);

    const result = await useCase.execute(userId.toString());

    expect(result.name).toBe("John");
    expect(result.email).toBe("john@example.com");
  });

  it("throws UserNotFoundError when user not found", async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(userId.toString())).rejects.toThrow(
      UserNotFoundError
    );
  });
});
