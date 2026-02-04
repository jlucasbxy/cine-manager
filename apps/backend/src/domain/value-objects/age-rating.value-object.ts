import z from "zod";
import { InvalidAgeRatingError } from "@/domain/errors/invalid-age-rating.error";

const ageRatingValues = [
  "L",
  "TEN",
  "TWELVE",
  "FOURTEEN",
  "SIXTEEN",
  "EIGHTEEN"
] as const;

type AgeRatingValues = (typeof ageRatingValues)[number];

export class AgeRating {
  private readonly value: AgeRatingValues;

  private constructor(value: AgeRatingValues) {
    this.value = value;
  }

  static create(value: string): AgeRating {
    const r = z.enum(ageRatingValues).safeParse(value);
    if (!r.success) {
      throw new InvalidAgeRatingError();
    }
    return new AgeRating(r.data);
  }

  static reconstitute(value: AgeRatingValues): AgeRating {
    return new AgeRating(value);
  }

  public getValue(): AgeRatingValues {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }
}
