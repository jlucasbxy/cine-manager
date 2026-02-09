import type { AuthService } from "@/application/interfaces/services";
import type {
  Login,
  Logout,
  RefreshTokens,
  RequestPasswordReset,
  ResetPassword,
  ValidateToken
} from "@/application/use-cases/auth";
import type {
  LoginDTO,
  LoginResultDTO,
  LogoutDTO,
  RefreshTokensDTO,
  RefreshTokensResultDTO,
  RequestPasswordResetDTO,
  ResetPasswordDTO,
  ValidateTokenDTO,
  ValidateTokenResultDTO
} from "@repo/dtos";

export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly loginUseCase: Login,
    private readonly logoutUseCase: Logout,
    private readonly refreshTokensUseCase: RefreshTokens,
    private readonly requestPasswordResetUseCase: RequestPasswordReset,
    private readonly resetPasswordUseCase: ResetPassword,
    private readonly validateTokenUseCase: ValidateToken
  ) {}

  async login(input: LoginDTO): Promise<LoginResultDTO> {
    return this.loginUseCase.execute(input);
  }

  async logout(input: LogoutDTO): Promise<void> {
    return this.logoutUseCase.execute(input);
  }

  async refreshTokens(
    input: RefreshTokensDTO
  ): Promise<RefreshTokensResultDTO> {
    return this.refreshTokensUseCase.execute(input);
  }

  async requestPasswordReset(input: RequestPasswordResetDTO): Promise<void> {
    return this.requestPasswordResetUseCase.execute(input);
  }

  async resetPassword(input: ResetPasswordDTO): Promise<void> {
    return this.resetPasswordUseCase.execute(input);
  }

  async validateToken(
    input: ValidateTokenDTO
  ): Promise<ValidateTokenResultDTO> {
    return this.validateTokenUseCase.execute(input);
  }
}
