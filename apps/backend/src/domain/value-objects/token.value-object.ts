import crypto from "node:crypto";
import { TokenInvalidError } from "@/domain/errors";

export class Token {
  private static readonly TOKEN_BYTES = 32;
  private static readonly TOKEN_HEX_LENGTH = Token.TOKEN_BYTES * 2;
  private static readonly HEX_REGEX = /^[0-9a-f]+$/;

  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Token {
    if (
      value.length !== Token.TOKEN_HEX_LENGTH ||
      !Token.HEX_REGEX.test(value)
    ) {
      throw new TokenInvalidError();
    }
    return new Token(value);
  }

  static generate(): Token {
    const value = crypto.randomBytes(Token.TOKEN_BYTES).toString("hex");
    return new Token(value);
  }

  static reconstitute(value: string): Token {
    return new Token(value);
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: Token): boolean {
    return this.value === other.value;
  }
}
