import type {
  CreateMovieDTO,
  UpdateMovieDTO,
  QueryMoviesDTO,
  MovieDTO,
  PaginatedResultDTO
} from "@repo/dtos";

export interface MovieService {
  createMovie(userId: string, input: CreateMovieDTO): Promise<MovieDTO>;
  updateMovie(id: string, input: UpdateMovieDTO): Promise<MovieDTO>;
  deleteMovie(id: string): Promise<void>;
  getMovie(id: string): Promise<MovieDTO>;
  listMovies(query: QueryMoviesDTO): Promise<PaginatedResultDTO<MovieDTO>>;
}
