import z from "zod";
import { InvalidEmailError } from "@/domain/errors";

export class Email {

  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Email {
    const r = z.email().safeParse(value);
    if (!r.success) {
      throw new InvalidEmailError();
    }
    return new Email(value);
  }

  static reconstitute(value: string): Email {
    return new Email(value);
  }

  public toString(): string {
    return this.value;
  }
}
