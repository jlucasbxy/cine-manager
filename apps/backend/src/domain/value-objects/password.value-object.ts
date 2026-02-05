import { InvalidPasswordError } from "@/domain/errors";

export class Password {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Password {
    if (value.length < 8 || value.length > 64) {
      throw new InvalidPasswordError();
    }
    return new Password(value);
  }

  static fromHash(hash: string): Password {
    return new Password(hash);
  }

  public toString(): string {
    return this.value;
  }
}
