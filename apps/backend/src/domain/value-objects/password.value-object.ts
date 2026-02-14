import { InvalidPasswordError } from "@/domain/errors";
import { passwordZodSchema } from "@repo/validators";

export class Password {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Password {
    const result = passwordZodSchema.safeParse(value);
    if (!result.success) {
      throw new InvalidPasswordError();
    }
    return new Password(value);
  }

  static reconstitute(hash: string): Password {
    return new Password(hash);
  }

  public toString(): string {
    return this.value;
  }
}
