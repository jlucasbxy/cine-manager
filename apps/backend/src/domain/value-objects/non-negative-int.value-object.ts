import z from "zod";
import { InvalidNonNegativeIntError } from "@/domain/errors";

export class NonNegativeInt {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static create(value: number): NonNegativeInt {
    const r = z.int().nonnegative().safeParse(value);
    if (!r.success) {
      throw new InvalidNonNegativeIntError();
    }
    return new NonNegativeInt(value);
  }

  static reconstitute(value: number): NonNegativeInt {
    return new NonNegativeInt(value);
  }

  public toNumber(): number {
    return this.value;
  }
}
