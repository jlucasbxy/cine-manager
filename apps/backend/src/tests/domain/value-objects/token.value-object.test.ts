import { Token } from "@/domain/value-objects/token.value-object";
import { TokenInvalidError } from "@/domain/errors";

describe("Token", () => {
  const validHex = "a".repeat(64);

  it("creates with valid 64-char hex string", () => {
    const token = Token.create(validHex);
    expect(token.toString()).toBe(validHex);
  });

  it("throws TokenInvalidError for short string", () => {
    expect(() => Token.create("abc")).toThrow(TokenInvalidError);
  });

  it("throws for non-hex characters", () => {
    expect(() => Token.create("g".repeat(64))).toThrow(TokenInvalidError);
  });

  it("throws for uppercase hex", () => {
    expect(() => Token.create("A".repeat(64))).toThrow(TokenInvalidError);
  });

  it("generates a valid token", () => {
    const token = Token.generate();
    expect(token.toString()).toHaveLength(64);
    expect(token.toString()).toMatch(/^[0-9a-f]+$/);
  });

  it("reconstitutes without validation", () => {
    const token = Token.reconstitute("anything");
    expect(token.toString()).toBe("anything");
  });

  it("equals returns true for same value", () => {
    const a = Token.create(validHex);
    const b = Token.create(validHex);
    expect(a.equals(b)).toBe(true);
  });

  it("equals returns false for different values", () => {
    const a = Token.generate();
    const b = Token.generate();
    expect(a.equals(b)).toBe(false);
  });
});
