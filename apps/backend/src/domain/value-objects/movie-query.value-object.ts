import z from "zod";
import { NonNegativeInt } from "@/domain/value-objects/non-negative-int.value-object";
import { InvalidMovieQueryError } from "@/domain/errors";

type MovieQueryProps = {
  runtime: number;
  releaseDateStart: string;
  releaseDateEnd: string;
  page: number;
  perPage: number;
};

const movieQuerySchema = z
  .object({
    runtime: z.int().nonnegative(),
    releaseDateStart: z.coerce.date(),
    releaseDateEnd: z.coerce.date(),
    page: z.int().nonnegative(),
    perPage: z.int().nonnegative()
  })
  .refine((data) => data.releaseDateStart <= data.releaseDateEnd, {
    message: "releaseDateStart must be before or equal to releaseDateEnd"
  });

export class MovieQuery {
  readonly runtime: NonNegativeInt;
  readonly releaseDateStart: Date;
  readonly releaseDateEnd: Date;
  readonly page: NonNegativeInt;
  readonly perPage: NonNegativeInt;

  private constructor(
    runtime: NonNegativeInt,
    releaseDateStart: Date,
    releaseDateEnd: Date,
    page: NonNegativeInt,
    perPage: NonNegativeInt
  ) {
    this.runtime = runtime;
    this.releaseDateStart = releaseDateStart;
    this.releaseDateEnd = releaseDateEnd;
    this.page = page;
    this.perPage = perPage;
  }

  static create(props: MovieQueryProps): MovieQuery {
    const r = movieQuerySchema.safeParse(props);
    if (!r.success) {
      throw new InvalidMovieQueryError(r.error.issues[0].message);
    }
    return new MovieQuery(
      NonNegativeInt.create(r.data.runtime),
      r.data.releaseDateStart,
      r.data.releaseDateEnd,
      NonNegativeInt.create(r.data.page),
      NonNegativeInt.create(r.data.perPage)
    );
  }
}
