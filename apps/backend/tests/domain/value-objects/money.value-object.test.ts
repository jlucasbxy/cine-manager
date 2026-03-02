import { InvalidNonNegativeNumberError } from "@/domain/errors";
import { Money } from "@/domain/value-objects/money.value-object";

describe("Money", () => {
  it("creates with 0", () => {
    const val = Money.create(0);
    expect(val.toNumber()).toBe(0);
  });

  it("creates with positive integer", () => {
    const val = Money.create(100);
    expect(val.toNumber()).toBe(100);
  });

  it("creates with two decimal places", () => {
    const val = Money.create(3.14);
    expect(val.toNumber()).toBe(3.14);
  });

  it("throws for negative value", () => {
    expect(() => Money.create(-0.1)).toThrow(InvalidNonNegativeNumberError);
  });

  it("throws for more than two decimal places", () => {
    expect(() => Money.create(1.999)).toThrow(InvalidNonNegativeNumberError);
  });

  it("throws for values above Decimal(15,2) max", () => {
    expect(() => Money.create(10_000_000_000_000)).toThrow(
      InvalidNonNegativeNumberError
    );
  });

  it("reconstitutes without validation", () => {
    const val = Money.reconstitute(42.5);
    expect(val.toNumber()).toBe(42.5);
  });
});
