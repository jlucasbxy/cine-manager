import z from "zod";
import type { Validator } from "./validator";
import type { LogoutDTO } from "@repo/dtos";

export class LogoutValidator implements Validator<LogoutDTO> {
  private readonly logoutSchema = z.object({
    refreshToken: z.string().min(1)
  });

  parse(data: unknown) {
    return this.logoutSchema.parse(data);
  }
}
