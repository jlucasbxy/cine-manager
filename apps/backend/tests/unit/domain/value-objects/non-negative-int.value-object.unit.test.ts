import { InvalidNonNegativeIntError } from "@/domain/errors";
import { NonNegativeInt } from "@/domain/value-objects/non-negative-int.value-object";

describe("NonNegativeInt", () => {
  it("creates with 0", () => {
    const val = NonNegativeInt.create(0);
    expect(val.toNumber()).toBe(0);
  });

  it("creates with positive integer", () => {
    const val = NonNegativeInt.create(42);
    expect(val.toNumber()).toBe(42);
  });

  it("throws for negative integer", () => {
    expect(() => NonNegativeInt.create(-1)).toThrow(InvalidNonNegativeIntError);
  });

  it("throws for non-integer", () => {
    expect(() => NonNegativeInt.create(1.5)).toThrow(
      InvalidNonNegativeIntError
    );
  });

  it("reconstitutes without validation", () => {
    const val = NonNegativeInt.reconstitute(-5);
    expect(val.toNumber()).toBe(-5);
  });
});
