import { Password } from "@/domain/value-objects/password.value-object";
import { InvalidPasswordError, WeakPasswordError } from "@/domain/errors";

describe("Password", () => {
  it("creates with valid strong password", () => {
    const password = Password.create("C0mpl3x!P@ss#2024");
    expect(password.toString()).toBe("C0mpl3x!P@ss#2024");
  });

  it("throws InvalidPasswordError for short password", () => {
    expect(() => Password.create("short")).toThrow(InvalidPasswordError);
  });

  it("throws for empty string", () => {
    expect(() => Password.create("")).toThrow(InvalidPasswordError);
  });

  it("throws WeakPasswordError for common weak password", () => {
    expect(() => Password.create("password123")).toThrow(WeakPasswordError);
  });

  it("throws WeakPasswordError for simple repeated patterns", () => {
    expect(() => Password.create("abcabcabc")).toThrow(WeakPasswordError);
  });

  it("reconstitutes without validation", () => {
    const password = Password.reconstitute("hashed-value");
    expect(password.toString()).toBe("hashed-value");
  });
});
