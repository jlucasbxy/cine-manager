import { InvalidPasswordError } from "@/domain/errors/invalid-password.error";

export class Password {
  private readonly value: string;

  constructor(value: string) {
    if (value.length < 8 || value.length > 64) {
      throw new InvalidPasswordError();
    }
    this.value = value;
  }

  public toString(): string {
    return this.value;
  }
}
