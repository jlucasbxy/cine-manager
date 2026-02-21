import type { MovieDTO } from "@repo/dtos";
import type { MovieRepository } from "@/application/interfaces/repositories";
import { MovieMapper } from "@/application/mappers";
import { MovieNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

interface GetMovieInput {
  id: string;
  currentUserId: string;
}

export class GetMovie {
  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(input: GetMovieInput): Promise<MovieDTO> {
    const result = await this.movieRepository.findByIdWithUser(
      Uuid.create(input.id)
    );
    if (!result) {
      throw new MovieNotFoundError();
    }

    if (!result.movie.isPublic && result.movie.userId.toString() !== input.currentUserId) {
      throw new MovieNotFoundError();
    }

    return MovieMapper.toDTO(result.movie, result.user ?? undefined);
  }
}
