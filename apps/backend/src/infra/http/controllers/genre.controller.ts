import type { FastifyReply, FastifyRequest } from "fastify";
import type { GenreService } from "@/application/interfaces/services";
import { sendWithEtag } from "@/infra/http/utils/etag";

export class GenreController {
  constructor(
    private readonly genreService: GenreService
  ) {}

  async listGenres(request: FastifyRequest, reply: FastifyReply) {
    const genres = await this.genreService.listGenres();
    return sendWithEtag(request, reply, genres);
  }
}
