import z from "zod";
import { InvalidRatingError } from "@/domain/errors/invalid-rating.error";

export class RatingValue {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static create(value: number): RatingValue {
    const r = z.number().int().min(1).max(10).safeParse(value);
    if (!r.success) {
      throw new InvalidRatingError();
    }
    return new RatingValue(value);
  }

  static reconstitute(value: number): RatingValue {
    return new RatingValue(value);
  }

  public toNumber(): number {
    return this.value;
  }
}
