import type { FastifyReply, FastifyRequest } from "fastify";
import type { LanguageService } from "@/application/interfaces/services";

export class LanguageController {
  constructor(
    private readonly languageService: LanguageService
  ) {}

  async listLanguages(request: FastifyRequest, reply: FastifyReply) {
    const languages = await this.languageService.listLanguages();
    return reply
      .header("Cache-Control", "private, max-age=86400")
      .status(200)
      .send(languages);
  }
}
