import crypto from "node:crypto";

export class Token {
  private static readonly TOKEN_BYTES = 32;
  private static readonly TOKEN_HEX_LENGTH = Token.TOKEN_BYTES * 2;

  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
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
