import z from "zod";
import type { Validator } from "./validator";
import type { RefreshTokensDTO } from "@repo/dtos";

export class RefreshTokensValidator implements Validator<RefreshTokensDTO> {
  private readonly refreshTokensSchema = z.object({
    refreshToken: z.string().min(1)
  });

  parse(data: unknown) {
    return this.refreshTokensSchema.parse(data);
  }
}
