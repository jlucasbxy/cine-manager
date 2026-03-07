import { InvalidEmailError } from "@/domain/errors";
import { Email } from "@/domain/value-objects/email.value-object";

describe("Email", () => {
  it("creates with valid email", () => {
    const email = Email.create("test@example.com");
    expect(email.toString()).toBe("test@example.com");
  });

  it("throws InvalidEmailError for invalid email", () => {
    expect(() => Email.create("invalid")).toThrow(InvalidEmailError);
  });

  it("throws for empty string", () => {
    expect(() => Email.create("")).toThrow(InvalidEmailError);
  });

  it("reconstitutes without validation", () => {
    const email = Email.reconstitute("anything");
    expect(email.toString()).toBe("anything");
  });
});
