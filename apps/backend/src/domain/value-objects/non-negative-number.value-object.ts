import z from "zod";
import { InvalidNonNegativeNumberError } from "@/domain/errors";

export class NonNegativeNumber {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static create(value: number): NonNegativeNumber {
    const r = z.number().nonnegative().safeParse(value);
    if (!r.success) {
      throw new InvalidNonNegativeNumberError();
    }
    return new NonNegativeNumber(value);
  }

  static reconstitute(value: number): NonNegativeNumber {
    return new NonNegativeNumber(value);
  }

  public toNumber(): number {
    return this.value;
  }
}
