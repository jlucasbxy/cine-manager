import z from "zod";
import { InvalidAgeRatingError } from "@/domain/errors";
import { AgeRatingEnum } from "@/domain/enums/age-rating.enum";

const ageRatingValues = Object.values(AgeRatingEnum) as [AgeRatingEnum, ...AgeRatingEnum[]];

export class AgeRating {
  private readonly value: AgeRatingEnum;

  private constructor(value: AgeRatingEnum) {
    this.value = value;
  }

  static create(value: string): AgeRating {
    const r = z.enum(ageRatingValues).safeParse(value);
    if (!r.success) {
      throw new InvalidAgeRatingError();
    }
    return new AgeRating(value as AgeRatingEnum);
  }

  static reconstitute(value: string): AgeRating {
    return new AgeRating(value as AgeRatingEnum);
  }

  public getValue(): AgeRatingEnum {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }
}
