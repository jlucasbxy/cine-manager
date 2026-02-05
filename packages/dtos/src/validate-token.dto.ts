export interface ValidateTokenDTO {
  token: string;
}

export interface ValidateTokenResultDTO {
  userId: string;
  valid: boolean;
}
