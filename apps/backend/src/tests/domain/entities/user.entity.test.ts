import { User } from "@/domain/entities/user.entity";
import { Email } from "@/domain/value-objects/email.value-object";
import { Password } from "@/domain/value-objects/password.value-object";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

describe("User", () => {
  const email = Email.create("test@example.com");
  const password = Password.create("ValidPass1");

  describe("create", () => {
    it("generates UUID and timestamps", () => {
      const user = User.create({ name: "John", email, password });

      expect(user.id.toString()).toMatch(/^[0-9a-f-]+$/);
      expect(user.name).toBe("John");
      expect(user.email.toString()).toBe("test@example.com");
      expect(user.password.toString()).toBe("ValidPass1");
      expect(user.avatarUrl).toBeUndefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
      expect(user.createdAt.getTime()).toBe(user.updatedAt.getTime());
    });
  });

  describe("reconstitute", () => {
    it("preserves all given props", () => {
      const id = Uuid.generate();
      const now = new Date();
      const user = User.reconstitute({
        id,
        name: "Jane",
        email,
        password,
        avatarUrl: "https://example.com/avatar.png",
        createdAt: now,
        updatedAt: now
      });

      expect(user.id).toBe(id);
      expect(user.name).toBe("Jane");
      expect(user.avatarUrl).toBe("https://example.com/avatar.png");
      expect(user.createdAt).toBe(now);
    });
  });
});
