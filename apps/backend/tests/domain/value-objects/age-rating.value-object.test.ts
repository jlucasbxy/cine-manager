import { AgeRating } from "@/domain/value-objects/age-rating.value-object";
import { AgeRatingEnum } from "@/domain/enums/age-rating.enum";
import { InvalidAgeRatingError } from "@/domain/errors";

describe("AgeRating", () => {
  it("creates with valid age rating", () => {
    const rating = AgeRating.create(AgeRatingEnum.L);
    expect(rating.getValue()).toBe(AgeRatingEnum.L);
    expect(rating.toString()).toBe("L");
  });

  it("creates with each valid value", () => {
    for (const value of Object.values(AgeRatingEnum)) {
      const rating = AgeRating.create(value);
      expect(rating.getValue()).toBe(value);
    }
  });

  it("throws InvalidAgeRatingError for invalid value", () => {
    expect(() => AgeRating.create("INVALID")).toThrow(InvalidAgeRatingError);
  });

  it("reconstitutes without validation", () => {
    const rating = AgeRating.reconstitute(AgeRatingEnum.EIGHTEEN);
    expect(rating.getValue()).toBe(AgeRatingEnum.EIGHTEEN);
  });
});
