import type { MovieListDTO } from "@repo/dtos";
import type { MovieListWithMovies } from "@/application/interfaces/repositories";
import type { MovieList } from "@/domain/entities";
import { MovieMapper } from "@/application/mappers/movie.mapper";

export class MovieListMapper {
  static toDTO(list: MovieList): MovieListDTO {
    return {
      id: list.id.toString(),
      name: list.name,
      userId: list.userId.toString(),
      createdAt: list.createdAt.toISOString(),
      updatedAt: list.updatedAt.toISOString()
    };
  }

  static toDTOWithMovies(list: MovieListWithMovies): MovieListDTO {
    return {
      id: list.id.toString(),
      name: list.name,
      userId: list.userId.toString(),
      createdAt: list.createdAt.toISOString(),
      updatedAt: list.updatedAt.toISOString(),
      movies: list.movies.map((m) => MovieMapper.toDTO(m))
    };
  }
}
