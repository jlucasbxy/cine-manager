export type LoginInput = {
  email: string;
  password: string;
};

export type LoginOutput = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type LogoutInput = {
  refreshToken: string;
};

export type RefreshTokenInput = {
  refreshToken: string;
};

export type RefreshTokenOutput = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type RequestPasswordResetInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  newPassword: string;
};

export type ValidateTokenInput = {
  token: string;
};

export type ValidateTokenOutput = {
  userId: string;
  valid: boolean;
};

export interface AuthService {
  login(input: LoginInput): Promise<LoginOutput>;
  logout(input: LogoutInput): Promise<void>;
  refreshTokens(input: RefreshTokenInput): Promise<RefreshTokenOutput>;
  requestPasswordReset(input: RequestPasswordResetInput): Promise<void>;
  resetPassword(input: ResetPasswordInput): Promise<void>;
  validateToken(input: ValidateTokenInput): Promise<ValidateTokenOutput>;
}
