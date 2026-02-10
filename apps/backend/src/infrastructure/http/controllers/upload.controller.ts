import type { FastifyReply, FastifyRequest } from "fastify";
import type { UploadService } from "@/application/interfaces/services";
import type { GenerateUploadUrlValidator } from "@repo/validators";

export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly generateUploadUrlValidator: GenerateUploadUrlValidator
  ) {}

  async generateUploadUrl(request: FastifyRequest, reply: FastifyReply) {
    const data = this.generateUploadUrlValidator.parse(request.body);
    const result = await this.uploadService.generateUploadUrl(
      request.userId,
      data
    );
    return reply.status(200).send(result);
  }
}
