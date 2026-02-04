import z from "zod";
import { InvalidAgeRatingError } from "@/domain/errors/invalid-age-rating.error";

export enum AgeRatingEnum {
  L = "L",
  TEN = "TEN",
  TWELVE = "TWELVE",
  FOURTEEN = "FOURTEEN",
  SIXTEEN = "SIXTEEN",
  EIGHTEEN = "EIGHTEEN",
}

export type AgeRatingValues = `${AgeRatingEnum}`;

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

  public getValue(): AgeRatingValues {
    return this.value as AgeRatingValues;
  }

  public toString(): string {
    return this.value;
  }
}