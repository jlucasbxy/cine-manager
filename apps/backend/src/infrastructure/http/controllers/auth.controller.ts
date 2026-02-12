import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthService } from "@/application/interfaces/services";
import type {
  LoginValidator,
  ResetPasswordValidator,
  EmailValidator
} from "@repo/validators";
import { ROUTE_PREFIXES } from "@/infrastructure/config/routes.config";

const REFRESH_TOKEN_COOKIE = "refreshToken";

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loginValidator: LoginValidator,
    private readonly emailValidator: EmailValidator,
    private readonly resetPasswordValidator: ResetPasswordValidator
  ) {}

  async login(request: FastifyRequest, reply: FastifyReply) {
    const data = this.loginValidator.parse(request.body);
    const result = await this.authService.login(data);

    this.setRefreshTokenCookie(reply, result.refreshToken);

    const { refreshToken: _, ...body } = result;
    return reply.status(200).send(body);
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const refreshToken = this.getRefreshTokenFromCookie(request);
    await this.authService.logout({ refreshToken });
    this.clearRefreshTokenCookie(reply);
    return reply.status(204).send();
  }

  async refreshTokens(request: FastifyRequest, reply: FastifyReply) {
    const refreshToken = this.getRefreshTokenFromCookie(request);
    const result = await this.authService.refreshTokens({ refreshToken });

    this.setRefreshTokenCookie(reply, result.refreshToken);

    const { refreshToken: _, ...body } = result;
    return reply.status(200).send(body);
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

  private getRefreshTokenFromCookie(request: FastifyRequest): string {
    const token = request.cookies[REFRESH_TOKEN_COOKIE];
    if (!token) {
      throw Object.assign(new Error("Missing refresh token cookie"), {
        statusCode: 401
      });
    }
    return token;
  }

  private setRefreshTokenCookie(reply: FastifyReply, token: string) {
    reply.setCookie(REFRESH_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: ROUTE_PREFIXES.auth
    });
  }

  private clearRefreshTokenCookie(reply: FastifyReply) {
    reply.clearCookie(REFRESH_TOKEN_COOKIE, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: ROUTE_PREFIXES.auth
    });
  }
}
