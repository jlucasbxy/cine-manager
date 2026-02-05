import z from "zod";
import { InvalidMovieStatusError } from "@/domain/errors";
import { MovieStatusEnum } from "@/domain/enums/movie-status.enum";

const movieStatusValues = Object.values(MovieStatusEnum) as [MovieStatusEnum, ...MovieStatusEnum[]];

export class MovieStatus {
  private readonly value: MovieStatusEnum;

  private constructor(value: MovieStatusEnum) {
    this.value = value;
  }

  static create(value: string): MovieStatus {
    const r = z.enum(movieStatusValues).safeParse(value);
    if (!r.success) {
      throw new InvalidMovieStatusError();
    }
    return new MovieStatus(value as MovieStatusEnum);
  }

  static reconstitute(value: string): MovieStatus {
    return new MovieStatus(value as MovieStatusEnum);
  }

  public getValue(): MovieStatusEnum {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }
}
