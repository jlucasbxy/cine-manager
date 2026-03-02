import type {
  LoginDTO,
  LoginResultDTO,
  LogoutDTO,
  RefreshTokensDTO,
  RefreshTokensResultDTO,
  RequestPasswordResetDTO,
  ResetPasswordDTO
} from "@repo/dtos";

export interface AuthService {
  login(input: LoginDTO): Promise<LoginResultDTO>;
  logout(input: LogoutDTO): Promise<void>;
  refreshTokens(input: RefreshTokensDTO): Promise<RefreshTokensResultDTO>;
  requestPasswordReset(input: RequestPasswordResetDTO): Promise<void>;
  resetPassword(input: ResetPasswordDTO): Promise<void>;
}
