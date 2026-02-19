import { AgeRating, MovieStatus } from "@repo/validators";

export interface QueryMoviesDTO {
  runtime?: number;
  releaseDateStart?: string;
  releaseDateEnd?: string;
  page: number;
  perPage: number;
  status?: MovieStatus;
  ageRating?: AgeRating;
  search?: string;
}

export interface PaginatedResultDTO<T> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}
