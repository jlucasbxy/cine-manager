import type { AgeRating, MovieStatus } from "@repo/validators";

export interface QueryMoviesDTO {
  runtime?: number;
  releaseDateStart?: string;
  releaseDateEnd?: string;
  cursor?: string;
  limit: number;
  status?: MovieStatus;
  ageRating?: AgeRating;
  search?: string;
  onlyMine?: boolean;
  genreIds?: string[];
}

export interface PaginatedResultDTO<T> {
  data: T[];
  meta: {
    limit: number;
    nextCursor: string | null;
    hasNextPage: boolean;
  };
}
