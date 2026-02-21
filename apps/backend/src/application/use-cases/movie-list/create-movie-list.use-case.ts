import type { CreateMovieListDTO, MovieListDTO } from "@repo/dtos";
import { MovieListMapper } from "@/application/mappers/movie-list.mapper";
import type { MovieListRepository } from "@/application/interfaces/repositories";
import { MovieList } from "@/domain/entities";
import { Uuid } from "@/domain/value-objects";

export class CreateMovieList {
  constructor(private readonly movieListRepository: MovieListRepository) {}

  async execute(userId: string, input: CreateMovieListDTO): Promise<MovieListDTO> {
    const userUuid = Uuid.create(userId);
    const list = MovieList.create({ name: input.name, userId: userUuid });
    const saved = await this.movieListRepository.create(list);
    return MovieListMapper.toDTO(saved);
  }
}
