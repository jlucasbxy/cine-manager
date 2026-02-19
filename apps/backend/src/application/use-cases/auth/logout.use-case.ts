import type { LogoutDTO } from "@repo/dtos";
import type { RefreshTokenRepository } from "@/application/interfaces/repositories";
import { Token } from "@/domain/value-objects";

export class Logout {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

  async execute(input: LogoutDTO): Promise<void> {
    await this.refreshTokenRepository.updateByToken(
      Token.create(input.refreshToken),
      { revokedAt: new Date() }
    );
  }
}
