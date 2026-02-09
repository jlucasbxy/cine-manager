import type { RefreshTokenRepository } from "@/application/interfaces/repositories";
import type { LogoutDTO } from "@repo/dtos";

export class Logout {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

  async execute(input: LogoutDTO): Promise<void> {
    const token = await this.refreshTokenRepository.findByToken(
      input.refreshToken
    );
    if (token) {
      const revokedToken = token.revoke();
      await this.refreshTokenRepository.revoke(revokedToken);
    }
  }
}
