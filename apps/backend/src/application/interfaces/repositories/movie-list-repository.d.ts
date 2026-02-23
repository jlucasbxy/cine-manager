import { Movie } from "@/domain/entities/movie.entity";
import { MovieList } from "@/domain/entities/movie-list.entity";
import { Uuid } from "@/domain/value-objects";

export interface MovieListWithMovies extends MovieList {
  movies: Movie[];
}

export interface MovieListRepository {
  create(list: MovieList): Promise<MovieList>;
  exists(id: Uuid, userId: Uuid): Promise<boolean>;
  findById(id: Uuid): Promise<MovieList | null>;
  findByIdWithMovies(id: Uuid): Promise<MovieListWithMovies | null>;
  findAllByUserId(userId: Uuid): Promise<MovieList[]>;
  update(id: Uuid, name: string): Promise<MovieList | null>;
  delete(id: Uuid, userId: Uuid): Promise<boolean>;
  addMovie(listId: Uuid, movieId: Uuid): Promise<void>;
  removeMovie(listId: Uuid, movieId: Uuid): Promise<void>;
}
