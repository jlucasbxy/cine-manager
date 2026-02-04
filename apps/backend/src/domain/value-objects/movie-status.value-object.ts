import z from "zod";
import { InvalidMovieStatusError } from "@/domain/errors/invalid-movie-status.error";

const movieStatusValues = [
  "RELEASED",
  "POST_PRODUCTION",
  "IN_PRODUCTION",
  "PLANNED",
  "CANCELED",
  "RUMORED"
] as const;

type MovieStatusValues = (typeof movieStatusValues)[number];

export class MovieStatus {
  private readonly value: MovieStatusValues;

  private constructor(value: MovieStatusValues) {
    this.value = value;
  }

  static create(value: string): MovieStatus {
    const r = z.enum(movieStatusValues).safeParse(value);
    if (!r.success) {
      throw new InvalidMovieStatusError();
    }
    return new MovieStatus(value as MovieStatusValues);
  }

  static reconstitute(value: MovieStatusValues): MovieStatus {
    return new MovieStatus(value);
  }

  public getValue(): MovieStatusValues {
    return this.value as MovieStatusValues;
  }

  public toString(): string {
    return this.value;
  }
}
