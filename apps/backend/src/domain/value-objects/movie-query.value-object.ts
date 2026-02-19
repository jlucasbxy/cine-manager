import z from "zod";
import { AgeRatingEnum } from "@/domain/enums/age-rating.enum";
import { MovieStatusEnum } from "@/domain/enums/movie-status.enum";
import { InvalidMovieQueryError } from "@/domain/errors";
import { NonNegativeInt } from "@/domain/value-objects/non-negative-int.value-object";

type MovieQueryProps = {
  runtime?: number;
  releaseDateStart?: string;
  releaseDateEnd?: string;
  page: number;
  perPage: number;
  status?: MovieStatusEnum;
  ageRating?: AgeRatingEnum;
  search?: string;
};

const movieQuerySchema = z
  .object({
    runtime: z.int().nonnegative().optional(),
    releaseDateStart: z.coerce.date().optional(),
    releaseDateEnd: z.coerce.date().optional(),
    page: z.int().nonnegative(),
    perPage: z.int().nonnegative(),
    status: z.enum(MovieStatusEnum).optional(),
    ageRating: z.enum(AgeRatingEnum).optional(),
    search: z.string().min(1).optional()
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
  readonly status?: MovieStatusEnum;
  readonly ageRating?: AgeRatingEnum;
  readonly search?: string;

  private constructor(
    page: NonNegativeInt,
    perPage: NonNegativeInt,
    runtime?: NonNegativeInt,
    releaseDateStart?: Date,
    releaseDateEnd?: Date,
    status?: MovieStatusEnum,
    ageRating?: AgeRatingEnum,
    search?: string
  ) {
    this.runtime = runtime;
    this.releaseDateStart = releaseDateStart;
    this.releaseDateEnd = releaseDateEnd;
    this.page = page;
    this.perPage = perPage;
    this.status = status;
    this.ageRating = ageRating;
    this.search = search;
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
      r.data.releaseDateEnd,
      r.data.status,
      r.data.ageRating,
      r.data.search
    );
  }
}
