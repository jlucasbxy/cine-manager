import type { TokenProvider } from "@/application/interfaces/providers";
import type { ValidateTokenDTO, ValidateTokenResultDTO } from "@repo/dtos";

export class ValidateToken {
  constructor(private readonly tokenProvider: TokenProvider) {}

  async execute(input: ValidateTokenDTO): Promise<ValidateTokenResultDTO> {
    try {
      const payload = await this.tokenProvider.verify(input.token);
      return {
        userId: payload.userId,
        valid: true
      };
    } catch {
      return {
        userId: "",
        valid: false
      };
    }
  }
}
