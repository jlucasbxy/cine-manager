import type { FastifyReply, FastifyRequest } from "fastify";
import type { MovieService } from "@/application/interfaces/services";
import type { CreateMovieValidator, UpdateMovieValidator, IdValidator, QueryMoviesValidator } from "@repo/validators";

export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly createMovieValidator: CreateMovieValidator,
    private readonly updateMovieValidator: UpdateMovieValidator,
    private readonly idValidator: IdValidator,
    private readonly queryMoviesValidator: QueryMoviesValidator
  ) { }

  async createMovie(request: FastifyRequest, reply: FastifyReply) {
    const data = this.createMovieValidator.parse(request.body);
    const movie = await this.movieService.createMovie(request.userId, data);
    return reply.status(201).send(movie);
  }

  async updateMovie(request: FastifyRequest, reply: FastifyReply) {
    const id = this.idValidator.parse(request.params);
    const data = this.updateMovieValidator.parse(request.body);
    const movie = await this.movieService.updateMovie(id, data);
    return reply.status(200).send(movie);
  }

  async deleteMovie(request: FastifyRequest, reply: FastifyReply) {
    const id = this.idValidator.parse(request.params);
    await this.movieService.deleteMovie(id);
    return reply.status(204).send();
  }

  async getMovie(request: FastifyRequest, reply: FastifyReply) {
    const id = this.idValidator.parse(request.params);
    const movie = await this.movieService.getMovie(id);
    return reply.status(200).send(movie);
  }

  async listMovies(request: FastifyRequest, reply: FastifyReply) {
    const query = this.queryMoviesValidator.parse(request.query);
    const movies = await this.movieService.listMovies(query);
    return reply.status(200).send(movies);
  }
}
