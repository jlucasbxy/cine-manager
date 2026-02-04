import z from "zod";
import { NonNegativeInt } from "@/domain/value-objects/non-negative-int.value-object";
import { InvalidMovieQueryError } from "@/domain/errors/invalid-movie-query.error";

type MovieQueryProps = {
  runtime: number;
  releaseDateStart: string;
  releaseDateEnd: string;
};

const movieQuerySchema = z.object({
  runtime: z.int().nonnegative(),
  releaseDateStart: z.coerce.date(),
  releaseDateEnd: z.coerce.date(),
}).refine(
  (data) => data.releaseDateStart <= data.releaseDateEnd,
  { message: "releaseDateStart must be before or equal to releaseDateEnd" }
);

export class MovieQuery {

  readonly runtime: NonNegativeInt;
  readonly releaseDateStart: Date;
  readonly releaseDateEnd: Date;

  private constructor(runtime: NonNegativeInt, releaseDateStart: Date, releaseDateEnd: Date) {
    this.runtime = runtime;
    this.releaseDateStart = releaseDateStart;
    this.releaseDateEnd = releaseDateEnd;
  }

  static create(props: MovieQueryProps): MovieQuery {
    const r = movieQuerySchema.safeParse(props);
    if (!r.success) {
      throw new InvalidMovieQueryError(r.error.issues[0].message);
    }
    return new MovieQuery(
      NonNegativeInt.create(r.data.runtime),
      r.data.releaseDateStart,
      r.data.releaseDateEnd
    );
  }
}
