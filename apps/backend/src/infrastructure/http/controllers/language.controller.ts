import type { FastifyReply, FastifyRequest } from "fastify";
import type { LanguageService } from "@/application/interfaces/services";
import { sendWithEtag } from "@/infrastructure/http/utils/etag";

export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  async listLanguages(request: FastifyRequest, reply: FastifyReply) {
    const languages = await this.languageService.listLanguages();
    return sendWithEtag(request, reply, languages);
  }
}
