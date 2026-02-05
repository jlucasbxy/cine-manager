import ms, { type StringValue } from "ms";
import type { UserRepository, RefreshTokenRepository } from "@/application/interfaces/repositories";
import type { HashProvider, TokenProvider } from "@/application/interfaces/providers";
import { RefreshToken } from "@/domain/entities";
import { Email } from "@/domain/value-objects";
import { InvalidCredentialsError } from "@/domain/errors";
import type { LoginDTO, LoginResultDTO } from "@repo/dtos";

export type LoginConfig = {
  accessTokenExpiresIn: StringValue;
  refreshTokenExpiresIn: StringValue;
};

export class Login {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly hashProvider: HashProvider,
    private readonly tokenProvider: TokenProvider,
    private readonly config: LoginConfig
  ) {}

  async execute(input: LoginDTO): Promise<LoginResultDTO> {
    const email = Email.create(input.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.hashProvider.compare({
      plaintext: input.password,
      hash: user.password.toString()
    });

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const accessToken = await this.tokenProvider.generate(
      { userId: user.id.toString() },
      this.config.accessTokenExpiresIn
    );

    const refreshTokenExpiresAt = new Date(
      Date.now() + ms(this.config.refreshTokenExpiresIn)
    );

    const refreshToken = RefreshToken.create({
      userId: user.id,
      expiresAt: refreshTokenExpiresAt
    });

    await this.refreshTokenRepository.create(refreshToken);

    return {
      accessToken,
      refreshToken: refreshToken.token.toString(),
      expiresIn: ms(this.config.accessTokenExpiresIn) / 1000
    };
  }
}
