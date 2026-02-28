import type { MovieListDTO } from "@repo/dtos";
import type { MovieListRepository } from "@/application/interfaces/repositories";
import { MovieListMapper } from "@/application/mappers/movie-list.mapper";
import { Uuid } from "@/domain/value-objects";

export class ListMovieLists {
  constructor(private readonly movieListRepository: MovieListRepository) {}

  async execute(userId: string): Promise<MovieListDTO[]> {
    const userUuid = Uuid.create(userId);
    const lists = await this.movieListRepository.findAllByUserId(userUuid);
    return lists.map(MovieListMapper.toDTO);
  }
}
