import { NonNegativeNumber } from "@/domain/value-objects/non-negative-number.value-object";
import { InvalidNonNegativeNumberError } from "@/domain/errors";

describe("NonNegativeNumber", () => {
  it("creates with 0", () => {
    const val = NonNegativeNumber.create(0);
    expect(val.toNumber()).toBe(0);
  });

  it("creates with positive decimal", () => {
    const val = NonNegativeNumber.create(3.14);
    expect(val.toNumber()).toBe(3.14);
  });

  it("creates with positive integer", () => {
    const val = NonNegativeNumber.create(100);
    expect(val.toNumber()).toBe(100);
  });

  it("throws for negative number", () => {
    expect(() => NonNegativeNumber.create(-0.1)).toThrow(
      InvalidNonNegativeNumberError
    );
  });

  it("reconstitutes without validation", () => {
    const val = NonNegativeNumber.reconstitute(-5);
    expect(val.toNumber()).toBe(-5);
  });
});
