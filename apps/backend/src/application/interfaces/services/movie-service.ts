import type {
  CreateMovieDTO,
  MovieDTO,
  PaginatedResultDTO,
  QueryMoviesDTO,
  RateMovieDTO,
  UpdateMovieDTO
} from "@repo/dtos";

export interface MovieService {
  createMovie(userId: string, input: CreateMovieDTO): Promise<MovieDTO>;
  updateMovie(id: string, userId: string, input: UpdateMovieDTO): Promise<MovieDTO>;
  deleteMovie(id: string, userId: string): Promise<void>;
  getMovie(id: string, currentUserId: string): Promise<MovieDTO>;
  listMovies(
    query: QueryMoviesDTO,
    userId: string
  ): Promise<PaginatedResultDTO<MovieDTO>>;
  rateMovie(
    movieId: string,
    userId: string,
    input: RateMovieDTO
  ): Promise<MovieDTO>;
}
