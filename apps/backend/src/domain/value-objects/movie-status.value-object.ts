import z from "zod";
import { MovieStatus as MovieStatusEnum } from "@/domain/enums/movie-status.enum";
import { InvalidMovieStatusError } from "@/domain/errors/invalid-movie-status.error";

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

  public getValue(): MovieStatusEnum {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }
}
