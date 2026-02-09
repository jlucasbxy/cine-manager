import type { FastifyReply, FastifyRequest } from "fastify";
import type { GenreService } from "@/application/interfaces/services";

export class GenreController {
  constructor(
    private readonly genreService: GenreService
  ) {}

  async listGenres(request: FastifyRequest, reply: FastifyReply) {
    const genres = await this.genreService.listGenres();
    return reply
      .header("Cache-Control", "private, max-age=86400")
      .status(200)
      .send(genres);
  }
}
