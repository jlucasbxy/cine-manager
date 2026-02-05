import type { Movie } from "@/domain/entities";
import type { MovieService } from "@/application/interfaces/services";
import type {
  CreateMovie,
  UpdateMovie,
  DeleteMovie,
  GetMovie,
  ListMovies
} from "@/application/use-cases/movie";
import type { CreateMovieDTO, UpdateMovieDTO, QueryMoviesDTO } from "@repo/dtos";

export class MovieServiceImpl implements MovieService {
  constructor(
    private readonly createMovieUseCase: CreateMovie,
    private readonly updateMovieUseCase: UpdateMovie,
    private readonly deleteMovieUseCase: DeleteMovie,
    private readonly getMovieUseCase: GetMovie,
    private readonly listMoviesUseCase: ListMovies
  ) {}

  async createMovie(input: CreateMovieDTO): Promise<Movie> {
    return this.createMovieUseCase.execute(input);
  }

  async updateMovie(id: string, input: UpdateMovieDTO): Promise<Movie> {
    return this.updateMovieUseCase.execute(id, input);
  }

  async deleteMovie(id: string): Promise<void> {
    return this.deleteMovieUseCase.execute(id);
  }

  async getMovie(id: string): Promise<Movie> {
    return this.getMovieUseCase.execute({ id });
  }

  async listMovies(query: QueryMoviesDTO): Promise<Movie[]> {
    return this.listMoviesUseCase.execute(query);
  }
}
