import type { MovieService } from "@/application/interfaces/services";
import type {
  CreateMovie,
  UpdateMovie,
  DeleteMovie,
  GetMovie,
  ListMovies
} from "@/application/use-cases/movie";
import type { CreateMovieDTO, UpdateMovieDTO, QueryMoviesDTO, MovieDTO } from "@repo/dtos";

export class MovieServiceImpl implements MovieService {
  constructor(
    private readonly createMovieUseCase: CreateMovie,
    private readonly updateMovieUseCase: UpdateMovie,
    private readonly deleteMovieUseCase: DeleteMovie,
    private readonly getMovieUseCase: GetMovie,
    private readonly listMoviesUseCase: ListMovies
  ) { }

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

  async listMovies(query: QueryMoviesDTO): Promise<MovieDTO[]> {
    return this.listMoviesUseCase.execute(query);
  }
}
