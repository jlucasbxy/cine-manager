import type { LoginDTO, LoginResultDTO } from "@repo/dtos";
import ms, { type StringValue } from "ms";
import type {
  HashProvider,
  TokenProvider,
  TransactionManager
} from "@/application/interfaces/providers";
import { RefreshToken } from "@/domain/entities";
import { InvalidCredentialsError } from "@/domain/errors";
import { Email } from "@/domain/value-objects";

type LoginConfig = {
  accessTokenExpiresIn: StringValue;
  refreshTokenExpiresIn: StringValue;
};

export class Login {
  constructor(
    private readonly transactionManager: TransactionManager,
    private readonly hashProvider: HashProvider,
    private readonly tokenProvider: TokenProvider,
    private readonly config: LoginConfig
  ) {}

  async execute(input: LoginDTO): Promise<LoginResultDTO> {
    const email = Email.create(input.email);

    return this.transactionManager.execute(async (repos) => {
      const user = await repos.userRepository.findByEmail(email);

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

      const refreshToken = RefreshToken.create({
        userId: user.id,
        expiresIn: this.config.refreshTokenExpiresIn
      });

      await repos.refreshTokenRepository.create(refreshToken);

      return {
        accessToken,
        refreshToken: refreshToken.token.toString(),
        expiresIn: ms(this.config.accessTokenExpiresIn) / 1000
      };
    });
  }
}
