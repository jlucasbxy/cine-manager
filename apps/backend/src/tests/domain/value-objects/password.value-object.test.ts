import { Password } from "@/domain/value-objects/password.value-object";
import { InvalidPasswordError } from "@/domain/errors";

describe("Password", () => {
  it("creates with valid password", () => {
    const password = Password.create("ValidPass1");
    expect(password.toString()).toBe("ValidPass1");
  });

  it("throws InvalidPasswordError for short password", () => {
    expect(() => Password.create("short")).toThrow(InvalidPasswordError);
  });

  it("throws for empty string", () => {
    expect(() => Password.create("")).toThrow(InvalidPasswordError);
  });

  it("reconstitutes without validation", () => {
    const password = Password.reconstitute("hashed-value");
    expect(password.toString()).toBe("hashed-value");
  });
});
