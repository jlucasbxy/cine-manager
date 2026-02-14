export interface QueryMoviesDTO {
  runtime: number;
  releaseDateStart: string;
  releaseDateEnd: string;
  page: number;
  perPage: number;
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
