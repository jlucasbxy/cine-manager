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
  cursor?: string;
  limit: number;
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
    cursor: z.string().uuid().optional(),
    limit: z.int().nonnegative(),
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
  readonly cursor?: Uuid;
  readonly limit: NonNegativeInt;
  readonly status?: MovieStatusEnum;
  readonly ageRating?: AgeRatingEnum;
  readonly search?: string;
  readonly userId?: Uuid;
  readonly genreIds?: string[];
  readonly currentUserId: Uuid;

  private constructor(
    limit: NonNegativeInt,
    currentUserId: Uuid,
    cursor?: Uuid,
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
    this.cursor = cursor;
    this.limit = limit;
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
      NonNegativeInt.create(r.data.limit),
      Uuid.create(r.data.currentUserId),
      r.data.cursor !== undefined ? Uuid.create(r.data.cursor) : undefined,
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
