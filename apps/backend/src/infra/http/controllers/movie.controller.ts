import type { FastifyReply, FastifyRequest } from "fastify";
import type { MovieService } from "@/application/interfaces/services";
import type { CreateMovieDTO, UpdateMovieDTO, QueryMoviesDTO } from "@repo/dtos";

export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly createMovieValidator: { parse(data: Record<string, unknown>): CreateMovieDTO },
    private readonly updateMovieValidator: { parse(data: Record<string, unknown>): UpdateMovieDTO },
    private readonly idValidator: { parse(data: string): { id: string } },
    private readonly queryMoviesValidator: { parse(data: Record<string, unknown>): QueryMoviesDTO }
  ) { }

  async createMovie(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as Record<string, unknown>;
    const data = this.createMovieValidator.parse({ ...body, userId: request.userId });
    const movie = await this.movieService.createMovie(data);
    return reply.status(201).send(movie);
  }

  async updateMovie(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = this.updateMovieValidator.parse({
      ...request.body as Record<string, unknown>,
      id: id
    });
    const movie = await this.movieService.updateMovie(id, data);
    return reply.status(200).send(movie);
  }

  async deleteMovie(request: FastifyRequest, reply: FastifyReply) {
    const { id } = this.idValidator.parse((request.params as { id: string }).id);
    await this.movieService.deleteMovie(id);
    return reply.status(204).send();
  }

  async getMovie(request: FastifyRequest, reply: FastifyReply) {
    const { id } = this.idValidator.parse((request.params as { id: string }).id);
    const movie = await this.movieService.getMovie(id);
    return reply.status(200).send(movie);
  }

  async listMovies(request: FastifyRequest, reply: FastifyReply) {
    const query = this.queryMoviesValidator.parse(request.query as Record<string, unknown>);
    const movies = await this.movieService.listMovies(query);
    return reply.status(200).send(movies);
  }
}
