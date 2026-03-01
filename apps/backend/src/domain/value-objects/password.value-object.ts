import {
  passwordZodSchema,
  PasswordStrengthValidator,
  MIN_PASSWORD_SCORE
} from "@repo/validators";
import { InvalidPasswordError, WeakPasswordError } from "@/domain/errors";

const strengthValidator = new PasswordStrengthValidator();

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
    const { score } = strengthValidator.check(value);
    if (score < MIN_PASSWORD_SCORE) {
      throw new WeakPasswordError();
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
