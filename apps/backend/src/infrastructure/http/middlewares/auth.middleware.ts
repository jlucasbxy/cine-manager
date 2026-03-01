import type { FastifyReply, FastifyRequest } from "fastify";
import type { TokenProvider } from "@/application/interfaces/providers";

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
  }
}

export class AuthMiddleware {
  constructor(private readonly tokenProvider: TokenProvider) {
    this.preHandler = this.preHandler.bind(this);
  }

  async preHandler(request: FastifyRequest, reply: FastifyReply) {
    const header = request.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return reply.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Missing or malformed authorization header"
      });
    }

    const token = header.slice(7);

    try {
      const result = await this.tokenProvider.verify(token);
      request.userId = result.userId;
    } catch {
      return reply.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Invalid or expired token"
      });
    }
  }
}
