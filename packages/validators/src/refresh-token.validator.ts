import z from "zod";
import type { Validator } from "./validator";

export class RefreshTokenValidator
  implements
    Validator<{
      refreshToken: string;
    }>
{
  private readonly refreshTokenSchema = z.object({
    refreshToken: z.string().min(1)
  });

  parse(data: unknown) {
    return this.refreshTokenSchema.parse(data);
  }
}
