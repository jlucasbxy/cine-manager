import z from "zod";
import { InvalidMovieStatusError } from "@/domain/errors/invalid-movie-status.error";

export enum MovieStatusEnum {
  RELEASED = "RELEASED",
  POST_PRODUCTION = "POST_PRODUCTION",
  IN_PRODUCTION = "IN_PRODUCTION",
  PLANNED = "PLANNED",
  CANCELED = "CANCELED",
  RUMORED = "RUMORED",
}

export type MovieStatusValues = `${MovieStatusEnum}`;

export class MovieStatus {
  private readonly value: MovieStatusEnum;

  private constructor(value: MovieStatusEnum) {
    this.value = value;
  }

  static create(value: string): MovieStatus {
    const r = z.nativeEnum(MovieStatusEnum).safeParse(value);
    if (!r.success) {
      throw new InvalidMovieStatusError();
    }
    return new MovieStatus(value as MovieStatusEnum);
  }

  static reconstitute(value: MovieStatusEnum): MovieStatus {
    return new MovieStatus(value);
  }

  public getValue(): MovieStatusValues {
    return this.value as MovieStatusValues;
  }

  public toString(): string {
    return this.value;
  }
}