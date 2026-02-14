import z from "zod";
import { NonNegativeInt } from "@/domain/value-objects/non-negative-int.value-object";
import { InvalidMovieQueryError } from "@/domain/errors";

type MovieQueryProps = {
  runtime?: number;
  releaseDateStart?: string;
  releaseDateEnd?: string;
  page: number;
  perPage: number;
};

const movieQuerySchema = z
  .object({
    runtime: z.int().nonnegative().optional(),
    releaseDateStart: z.coerce.date().optional(),
    releaseDateEnd: z.coerce.date().optional(),
    page: z.int().nonnegative(),
    perPage: z.int().nonnegative()
  })
  .refine(
    (data) => {
      if (data.releaseDateStart && data.releaseDateEnd) {
        return data.releaseDateStart <= data.releaseDateEnd;
      }
      return true;
    },
    { message: "releaseDateStart must be before or equal to releaseDateEnd" }
  );

export class MovieQuery {
  readonly runtime?: NonNegativeInt;
  readonly releaseDateStart?: Date;
  readonly releaseDateEnd?: Date;
  readonly page: NonNegativeInt;
  readonly perPage: NonNegativeInt;

  private constructor(
    page: NonNegativeInt,
    perPage: NonNegativeInt,
    runtime?: NonNegativeInt,
    releaseDateStart?: Date,
    releaseDateEnd?: Date
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
      NonNegativeInt.create(r.data.page),
      NonNegativeInt.create(r.data.perPage),
      r.data.runtime !== undefined
        ? NonNegativeInt.create(r.data.runtime)
        : undefined,
      r.data.releaseDateStart,
      r.data.releaseDateEnd
    );
  }
}
