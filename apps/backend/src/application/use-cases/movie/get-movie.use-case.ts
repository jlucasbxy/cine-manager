import type { MovieDTO } from "@repo/dtos";
import type {
  MovieRepository,
  UserRepository
} from "@/application/interfaces/repositories";
import { MovieMapper } from "@/application/mappers";
import { MovieNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

interface GetMovieInput {
  id: string;
}

export class GetMovie {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: GetMovieInput): Promise<MovieDTO> {
    const movie = await this.movieRepository.findById(Uuid.create(input.id));
    if (!movie) {
      throw new MovieNotFoundError();
    }

    const user = await this.userRepository.findById(movie.userId);
    const userInfo = user
      ? { id: user.id.toString(), name: user.name, avatarUrl: user.avatarUrl ?? null }
      : undefined;

    return MovieMapper.toDTO(movie, userInfo);
  }
}
