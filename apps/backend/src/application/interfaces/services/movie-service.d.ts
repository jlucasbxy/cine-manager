import type { Movie } from "@/domain/entities";
import type { CreateMovieDTO, UpdateMovieDTO, QueryMoviesDTO } from "@repo/dtos";

export interface MovieService {
  createMovie(input: CreateMovieDTO): Promise<Movie>;
  updateMovie(id: string, input: UpdateMovieDTO): Promise<Movie>;
  deleteMovie(id: string): Promise<void>;
  getMovie(id: string): Promise<Movie>;
  listMovies(query: QueryMoviesDTO): Promise<Movie[]>;
}
