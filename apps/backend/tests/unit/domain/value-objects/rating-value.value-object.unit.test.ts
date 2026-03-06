import { RatingValue } from "@/domain/value-objects/rating-value.value-object";
import { InvalidRatingError } from "@/domain/errors";

describe("RatingValue", () => {
  it("creates with value 1 (min)", () => {
    const rating = RatingValue.create(1);
    expect(rating.toNumber()).toBe(1);
  });

  it("creates with value 10 (max)", () => {
    const rating = RatingValue.create(10);
    expect(rating.toNumber()).toBe(10);
  });

  it("creates with value 5", () => {
    const rating = RatingValue.create(5);
    expect(rating.toNumber()).toBe(5);
  });

  it("throws InvalidRatingError for 0", () => {
    expect(() => RatingValue.create(0)).toThrow(InvalidRatingError);
  });

  it("throws InvalidRatingError for 11", () => {
    expect(() => RatingValue.create(11)).toThrow(InvalidRatingError);
  });

  it("throws for non-integer", () => {
    expect(() => RatingValue.create(5.5)).toThrow(InvalidRatingError);
  });

  it("throws for negative value", () => {
    expect(() => RatingValue.create(-1)).toThrow(InvalidRatingError);
  });

  it("reconstitutes without validation", () => {
    const rating = RatingValue.reconstitute(99);
    expect(rating.toNumber()).toBe(99);
  });
});
