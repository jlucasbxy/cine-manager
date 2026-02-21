import type {
  AddMovieToListValidator,
  CreateMovieListValidator,
  IdValidator,
  UpdateMovieListValidator
} from "@repo/validators";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { MovieListService } from "@/application/interfaces/services";

export class MovieListController {
  constructor(
    private readonly movieListService: MovieListService,
    private readonly createMovieListValidator: CreateMovieListValidator,
    private readonly updateMovieListValidator: UpdateMovieListValidator,
    private readonly addMovieToListValidator: AddMovieToListValidator,
    private readonly idValidator: IdValidator
  ) {}

  async createList(request: FastifyRequest, reply: FastifyReply) {
    const data = this.createMovieListValidator.parse(request.body);
    const list = await this.movieListService.createList(request.userId, data);
    return reply.status(201).send(list);
  }

  async getLists(request: FastifyRequest, reply: FastifyReply) {
    const lists = await this.movieListService.getLists(request.userId);
    return reply.status(200).send(lists);
  }

  async getList(request: FastifyRequest, reply: FastifyReply) {
    const id = this.idValidator.parse(request.params);
    const list = await this.movieListService.getList(id, request.userId);
    return reply.status(200).send(list);
  }

  async updateList(request: FastifyRequest, reply: FastifyReply) {
    const id = this.idValidator.parse(request.params);
    const data = this.updateMovieListValidator.parse(request.body);
    const list = await this.movieListService.updateList(id, request.userId, data);
    return reply.status(200).send(list);
  }

  async deleteList(request: FastifyRequest, reply: FastifyReply) {
    const id = this.idValidator.parse(request.params);
    await this.movieListService.deleteList(id, request.userId);
    return reply.status(204).send();
  }

  async addMovie(request: FastifyRequest, reply: FastifyReply) {
    const id = this.idValidator.parse(request.params);
    const data = this.addMovieToListValidator.parse(request.body);
    await this.movieListService.addMovie(id, request.userId, data);
    return reply.status(200).send();
  }

  async removeMovie(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string; movieId: string };
    const listId = this.idValidator.parse({ id: params.id });
    const movieId = this.idValidator.parse({ id: params.movieId });
    await this.movieListService.removeMovie(listId, movieId, request.userId);
    return reply.status(204).send();
  }
}
