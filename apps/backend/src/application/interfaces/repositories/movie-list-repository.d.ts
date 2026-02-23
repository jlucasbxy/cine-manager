import { Movie } from "@/domain/entities/movie.entity";
import { MovieList } from "@/domain/entities/movie-list.entity";
import { Uuid } from "@/domain/value-objects";

export interface MovieListWithMovies extends MovieList {
  movies: Movie[];
}

export interface MovieListRepository {
  create(list: MovieList): Promise<MovieList>;
  findByIdAndUserIdWithMovies(
    id: Uuid,
    userId: Uuid
  ): Promise<MovieListWithMovies | null>;
  findAllByUserId(userId: Uuid): Promise<MovieList[]>;
  updateByIdAndUserId(
    id: Uuid,
    userId: Uuid,
    name: string
  ): Promise<MovieList | null>;
  deleteByIdAndUserId(id: Uuid, userId: Uuid): Promise<boolean>;
  addMovie(listId: Uuid, userId: Uuid, movieId: Uuid): Promise<'ok' | 'list_not_found' | 'movie_not_found'>;
  removeMovieByListIdAndMovieId(listId: Uuid, userId: Uuid, movieId: Uuid): Promise<boolean>;
}
