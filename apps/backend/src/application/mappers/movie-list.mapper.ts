import type { MovieListDTO } from "@repo/dtos";
import type { MovieListWithMovies } from "@/application/interfaces/repositories";
import { MovieMapper } from "@/application/mappers/movie.mapper";
import type { MovieList } from "@/domain/entities";

export const MovieListMapper = {
  toDTO(list: MovieList): MovieListDTO {
    return {
      id: list.id.toString(),
      name: list.name,
      userId: list.userId.toString(),
      createdAt: list.createdAt.toISOString(),
      updatedAt: list.updatedAt.toISOString()
    };
  },

  toDTOWithMovies(list: MovieListWithMovies): MovieListDTO {
    return {
      id: list.id.toString(),
      name: list.name,
      userId: list.userId.toString(),
      createdAt: list.createdAt.toISOString(),
      updatedAt: list.updatedAt.toISOString(),
      movies: list.movies.map((m) => MovieMapper.toDTO(m))
    };
  }
};
