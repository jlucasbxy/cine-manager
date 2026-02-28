import type {
  AddMovieToListDTO,
  CreateMovieListDTO,
  MovieListDTO,
  UpdateMovieListDTO
} from "@repo/dtos";
import type { MovieListService } from "@/application/interfaces/services";
import type {
  AddMovieToList,
  CreateMovieList,
  DeleteMovieList,
  GetMovieList,
  ListMovieLists,
  RemoveMovieFromList,
  UpdateMovieList
} from "@/application/use-cases/movie-list";

export class MovieListServiceImpl implements MovieListService {
  constructor(
    private readonly createMovieListUseCase: CreateMovieList,
    private readonly listMovieListsUseCase: ListMovieLists,
    private readonly getMovieListUseCase: GetMovieList,
    private readonly updateMovieListUseCase: UpdateMovieList,
    private readonly deleteMovieListUseCase: DeleteMovieList,
    private readonly addMovieToListUseCase: AddMovieToList,
    private readonly removeMovieFromListUseCase: RemoveMovieFromList
  ) {}

  async createList(
    userId: string,
    input: CreateMovieListDTO
  ): Promise<MovieListDTO> {
    return this.createMovieListUseCase.execute(userId, input);
  }

  async getLists(userId: string): Promise<MovieListDTO[]> {
    return this.listMovieListsUseCase.execute(userId);
  }

  async getList(id: string, userId: string): Promise<MovieListDTO> {
    return this.getMovieListUseCase.execute(id, userId);
  }

  async updateList(
    id: string,
    userId: string,
    input: UpdateMovieListDTO
  ): Promise<MovieListDTO> {
    return this.updateMovieListUseCase.execute(id, userId, input);
  }

  async deleteList(id: string, userId: string): Promise<void> {
    return this.deleteMovieListUseCase.execute(id, userId);
  }

  async addMovie(
    listId: string,
    userId: string,
    input: AddMovieToListDTO
  ): Promise<void> {
    return this.addMovieToListUseCase.execute(listId, userId, input);
  }

  async removeMovie(
    listId: string,
    movieId: string,
    userId: string
  ): Promise<void> {
    return this.removeMovieFromListUseCase.execute(listId, movieId, userId);
  }
}
