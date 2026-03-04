import { InvalidNonNegativeDecimalError } from "@/domain/errors";

const MAX_MONEY_AMOUNT = 9_999_999_999_999.99; // Decimal(15, 2)
const DECIMAL_TOLERANCE = 1e-8;

export class Money {
  private readonly cents: number;

  private constructor(cents: number) {
    this.cents = cents;
  }

  static create(value: number): Money {
    if (!Number.isFinite(value) || value < 0 || value > MAX_MONEY_AMOUNT) {
      throw new InvalidNonNegativeDecimalError();
    }

    const scaled = value * 100;
    const rounded = Math.round(scaled);

    if (Math.abs(scaled - rounded) > DECIMAL_TOLERANCE) {
      throw new InvalidNonNegativeDecimalError();
    }

    return new Money(rounded);
  }

  static reconstitute(value: number): Money {
    return new Money(Math.round(value * 100));
  }

  public toNumber(): number {
    return this.cents / 100;
  }
}
