import type {
  AddMovieToListDTO,
  CreateMovieListDTO,
  MovieListDTO,
  UpdateMovieListDTO
} from "@repo/dtos";

export interface MovieListService {
  createList(userId: string, input: CreateMovieListDTO): Promise<MovieListDTO>;
  getLists(userId: string): Promise<MovieListDTO[]>;
  getList(id: string, userId: string): Promise<MovieListDTO>;
  updateList(id: string, userId: string, input: UpdateMovieListDTO): Promise<MovieListDTO>;
  deleteList(id: string, userId: string): Promise<void>;
  addMovie(listId: string, userId: string, input: AddMovieToListDTO): Promise<void>;
  removeMovie(listId: string, movieId: string, userId: string): Promise<void>;
}
