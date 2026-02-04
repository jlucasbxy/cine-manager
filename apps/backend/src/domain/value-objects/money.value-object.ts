import z from "zod";
import { InvalidMoneyError } from "@/domain/errors/invalid-money.error";

export class Money {

  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static create(value: number): Money {
    const r = z.number().nonnegative().safeParse(value);
    if (!r.success) {
      throw new InvalidMoneyError();
    }
    return new Money(value);
  }

  static reconstitute(value: number): Money {
    return new Money(value);
  }

  public toNumber(): number {
    return this.value;
  }
}
