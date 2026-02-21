import z from "zod";
import { AgeRatingEnum } from "@/domain/enums/age-rating.enum";
import { MovieStatusEnum } from "@/domain/enums/movie-status.enum";
import { InvalidMovieQueryError } from "@/domain/errors";
import { NonNegativeInt } from "@/domain/value-objects/non-negative-int.value-object";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

type MovieQueryProps = {
  runtime?: number;
  releaseDateStart?: string;
  releaseDateEnd?: string;
  page: number;
  perPage: number;
  status?: MovieStatusEnum;
  ageRating?: AgeRatingEnum;
  search?: string;
  userId?: string;
  genreIds?: string[];
  currentUserId: string;
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
    search: z.string().min(1).optional(),
    userId: z.uuidv7().optional(),
    genreIds: z.array(z.string()).optional(),
    currentUserId: z.uuidv7()
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
  readonly userId?: Uuid;
  readonly genreIds?: string[];
  readonly currentUserId: Uuid;

  private constructor(
    page: NonNegativeInt,
    perPage: NonNegativeInt,
    currentUserId: Uuid,
    runtime?: NonNegativeInt,
    releaseDateStart?: Date,
    releaseDateEnd?: Date,
    status?: MovieStatusEnum,
    ageRating?: AgeRatingEnum,
    search?: string,
    userId?: Uuid,
    genreIds?: string[]
  ) {
    this.runtime = runtime;
    this.releaseDateStart = releaseDateStart;
    this.releaseDateEnd = releaseDateEnd;
    this.page = page;
    this.perPage = perPage;
    this.status = status;
    this.ageRating = ageRating;
    this.search = search;
    this.userId = userId;
    this.genreIds = genreIds;
    this.currentUserId = currentUserId;
  }

  static create(props: MovieQueryProps): MovieQuery {
    const r = movieQuerySchema.safeParse(props);
    if (!r.success) {
      throw new InvalidMovieQueryError(r.error.issues[0].message);
    }
    return new MovieQuery(
      NonNegativeInt.create(r.data.page),
      NonNegativeInt.create(r.data.perPage),
      Uuid.create(r.data.currentUserId),
      r.data.runtime !== undefined
        ? NonNegativeInt.create(r.data.runtime)
        : undefined,
      r.data.releaseDateStart,
      r.data.releaseDateEnd,
      r.data.status,
      r.data.ageRating,
      r.data.search,
      r.data.userId !== undefined ? Uuid.create(r.data.userId) : undefined,
      r.data.genreIds
    );
  }
}
