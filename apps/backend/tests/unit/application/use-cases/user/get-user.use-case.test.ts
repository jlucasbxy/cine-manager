import { GetUser } from "@/application/use-cases/user/get-user.use-case";
import { UserNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";
import { makeUser } from "../../../../factories";

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
    const user = makeUser({
      id: userId,
      name: "John",
      email: "john@example.com",
      password: "hashed"
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
