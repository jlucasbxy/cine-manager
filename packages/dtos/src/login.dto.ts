export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResultDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
