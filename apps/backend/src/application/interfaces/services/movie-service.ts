import type {
  CreateMovieDTO,
  UpdateMovieDTO,
  QueryMoviesDTO,
  MovieDTO,
  PaginatedResultDTO,
  RateMovieDTO
} from "@repo/dtos";

export interface MovieService {
  createMovie(userId: string, input: CreateMovieDTO): Promise<MovieDTO>;
  updateMovie(id: string, input: UpdateMovieDTO): Promise<MovieDTO>;
  deleteMovie(id: string): Promise<void>;
  getMovie(id: string, currentUserId: string): Promise<MovieDTO>;
  listMovies(
    query: QueryMoviesDTO,
    userId: string
  ): Promise<PaginatedResultDTO<MovieDTO>>;
  rateMovie(movieId: string, userId: string, input: RateMovieDTO): Promise<MovieDTO>;
}
