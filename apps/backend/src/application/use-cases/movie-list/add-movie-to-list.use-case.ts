import type { AddMovieToListDTO } from "@repo/dtos";
import type { MovieListRepository } from "@/application/interfaces/repositories";
import { MovieListNotFoundError, MovieNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

export class AddMovieToList {
  constructor(private readonly movieListRepository: MovieListRepository) {}

  async execute(listId: string, userId: string, input: AddMovieToListDTO): Promise<void> {
    const listUuid = Uuid.create(listId);
    const userUuid = Uuid.create(userId);
    const movieUuid = Uuid.create(input.movieId);

    const result = await this.movieListRepository.addMovie(listUuid, userUuid, movieUuid);
    if (result === 'list_not_found') throw new MovieListNotFoundError();
    if (result === 'movie_not_found') throw new MovieNotFoundError();
  }
}
