import z from "zod";
import { AgeRating as AgeRatingEnum } from "@/domain/enums/age-rating.enum";
import { InvalidAgeRatingError } from "@/domain/errors/invalid-age-rating.error";

export class AgeRating {
  private readonly value: AgeRatingEnum;

  private constructor(value: AgeRatingEnum) {
    this.value = value;
  }

  static create(value: string): AgeRating {
    const r = z.nativeEnum(AgeRatingEnum).safeParse(value);
    if (!r.success) {
      throw new InvalidAgeRatingError();
    }
    return new AgeRating(value as AgeRatingEnum);
  }

  static reconstitute(value: AgeRatingEnum): AgeRating {
    return new AgeRating(value);
  }

  public getValue(): AgeRatingEnum {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }
}
