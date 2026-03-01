import { UserMapper } from "@/application/mappers/user.mapper";
import { User } from "@/domain/entities/user.entity";
import { Email, Password, Uuid } from "@/domain/value-objects";

describe("UserMapper", () => {
  describe("toDTO", () => {
    it("maps user entity to DTO", () => {
      const now = new Date("2024-06-01T12:00:00Z");
      const user = User.reconstitute({
        id: Uuid.reconstitute("test-id"),
        name: "John",
        email: Email.reconstitute("john@example.com"),
        password: Password.reconstitute("hashed"),
        avatarUrl: "https://example.com/avatar.png",
        createdAt: now,
        updatedAt: now
      });

      const dto = UserMapper.toDTO(user);

      expect(dto).toEqual({
        id: "test-id",
        name: "John",
        email: "john@example.com",
        avatarUrl: "https://example.com/avatar.png",
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      });
    });

    it("maps avatarUrl to null when undefined", () => {
      const user = User.reconstitute({
        id: Uuid.reconstitute("test-id"),
        name: "Jane",
        email: Email.reconstitute("jane@example.com"),
        password: Password.reconstitute("hashed"),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const dto = UserMapper.toDTO(user);
      expect(dto.avatarUrl).toBeNull();
    });
  });
});
