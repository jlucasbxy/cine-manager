import type {
  CreateMovieDTO,
  MovieDTO,
  PaginatedResultDTO,
  QueryMoviesDTO,
  RateMovieDTO,
  UpdateMovieDTO
} from "@repo/dtos";
import type { MovieService } from "@/application/interfaces/services";
import type {
  CreateMovie,
  DeleteMovie,
  GetMovie,
  ListMovies,
  RateMovie,
  UpdateMovie
} from "@/application/use-cases/movie";

export class MovieServiceImpl implements MovieService {
  constructor(
    private readonly createMovieUseCase: CreateMovie,
    private readonly updateMovieUseCase: UpdateMovie,
    private readonly deleteMovieUseCase: DeleteMovie,
    private readonly getMovieUseCase: GetMovie,
    private readonly listMoviesUseCase: ListMovies,
    private readonly rateMovieUseCase: RateMovie
  ) {}

  async createMovie(userId: string, input: CreateMovieDTO): Promise<MovieDTO> {
    return this.createMovieUseCase.execute(userId, input);
  }

  async updateMovie(id: string, input: UpdateMovieDTO): Promise<MovieDTO> {
    return this.updateMovieUseCase.execute(id, input);
  }

  async deleteMovie(id: string): Promise<void> {
    return this.deleteMovieUseCase.execute(id);
  }

  async getMovie(id: string): Promise<MovieDTO> {
    return this.getMovieUseCase.execute({ id });
  }

  async listMovies(
    query: QueryMoviesDTO,
    userId: string
  ): Promise<PaginatedResultDTO<MovieDTO>> {
    return this.listMoviesUseCase.execute(query, userId);
  }

  async rateMovie(movieId: string, userId: string, input: RateMovieDTO): Promise<MovieDTO> {
    return this.rateMovieUseCase.execute(movieId, userId, input);
  }
}
