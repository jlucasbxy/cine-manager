import z from "zod";
import { InvalidNonNegativeDecimalError } from "@/domain/errors";

export class NonNegativeDecimal {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static create(value: number): NonNegativeDecimal {
    const r = z.number().nonnegative().safeParse(value);
    if (!r.success) {
      throw new InvalidNonNegativeDecimalError();
    }
    return new NonNegativeDecimal(value);
  }

  static reconstitute(value: number): NonNegativeDecimal {
    return new NonNegativeDecimal(value);
  }

  public toNumber(): number {
    return this.value;
  }
}
