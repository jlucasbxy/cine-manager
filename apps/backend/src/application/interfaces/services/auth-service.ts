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

export interface AuthService {
  login(input: LoginDTO): Promise<LoginResultDTO>;
  logout(input: LogoutDTO): Promise<void>;
  refreshTokens(input: RefreshTokensDTO): Promise<RefreshTokensResultDTO>;
  requestPasswordReset(input: RequestPasswordResetDTO): Promise<void>;
  resetPassword(input: ResetPasswordDTO): Promise<void>;
  validateToken(input: ValidateTokenDTO): Promise<ValidateTokenResultDTO>;
}
