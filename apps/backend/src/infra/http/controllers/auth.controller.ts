import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthService } from "@/application/interfaces/services";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(request: FastifyRequest, reply: FastifyReply) {
    const result = await this.authService.login(
      request.body as { email: string; password: string }
    );
    return reply.status(200).send(result);
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    await this.authService.logout(
      request.body as { refreshToken: string }
    );
    return reply.status(204).send();
  }

  async refreshTokens(request: FastifyRequest, reply: FastifyReply) {
    const result = await this.authService.refreshTokens(
      request.body as { refreshToken: string }
    );
    return reply.status(200).send(result);
  }

  async requestPasswordReset(request: FastifyRequest, reply: FastifyReply) {
    await this.authService.requestPasswordReset(
      request.body as { email: string }
    );
    return reply.status(204).send();
  }

  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    await this.authService.resetPassword(
      request.body as { token: string; newPassword: string }
    );
    return reply.status(204).send();
  }
}
