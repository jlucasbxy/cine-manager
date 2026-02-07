import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthService } from "@/application/interfaces/services";
import type {
  LoginValidator,
  ResetPasswordValidator,
  EmailValidator,
  RefreshTokenValidator
} from "@repo/validators";

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loginValidator: LoginValidator,
    private readonly emailValidator: EmailValidator,
    private readonly refreshTokenValidator: RefreshTokenValidator,
    private readonly resetPasswordValidator: ResetPasswordValidator
  ) {}

  async login(request: FastifyRequest, reply: FastifyReply) {
    const data = this.loginValidator.parse(request.body);
    const result = await this.authService.login(data);
    return reply.status(200).send(result);
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const data = this.refreshTokenValidator.parse(request.body);
    await this.authService.logout(data);
    return reply.status(204).send();
  }

  async refreshTokens(request: FastifyRequest, reply: FastifyReply) {
    const data = this.refreshTokenValidator.parse(request.body);
    const result = await this.authService.refreshTokens(data);
    return reply.status(200).send(result);
  }

  async requestPasswordReset(request: FastifyRequest, reply: FastifyReply) {
    const data = this.emailValidator.parse(request.body);
    await this.authService.requestPasswordReset(data);
    return reply.status(204).send();
  }

  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    const data = this.resetPasswordValidator.parse(request.body);
    await this.authService.resetPassword(data);
    return reply.status(204).send();
  }
}
