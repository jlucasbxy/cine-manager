export interface RefreshTokensDTO {
  refreshToken: string;
}

export interface RefreshTokensResultDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
