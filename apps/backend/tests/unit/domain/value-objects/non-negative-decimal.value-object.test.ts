import { NonNegativeDecimal } from "@/domain/value-objects/non-negative-decimal.value-object";
import { InvalidNonNegativeDecimalError } from "@/domain/errors";

describe("NonNegativeDecimal", () => {
  it("creates with 0", () => {
    const val = NonNegativeDecimal.create(0);
    expect(val.toNumber()).toBe(0);
  });

  it("creates with positive decimal", () => {
    const val = NonNegativeDecimal.create(3.14);
    expect(val.toNumber()).toBe(3.14);
  });

  it("creates with positive integer", () => {
    const val = NonNegativeDecimal.create(100);
    expect(val.toNumber()).toBe(100);
  });

  it("throws for negative number", () => {
    expect(() => NonNegativeDecimal.create(-0.1)).toThrow(
      InvalidNonNegativeDecimalError
    );
  });

  it("reconstitutes without validation", () => {
    const val = NonNegativeDecimal.reconstitute(-5);
    expect(val.toNumber()).toBe(-5);
  });
});
