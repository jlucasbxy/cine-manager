import z from "zod";
import type { Validator } from "./validator";
import type { ResetPasswordDTO } from "@repo/dtos";

export class ResetPasswordValidator implements Validator<ResetPasswordDTO> {
  private readonly resetPasswordSchema = z.object({
    token: z.string().min(1),
    newPassword: z.string().min(8)
  });

  parse(data: unknown) {
    return this.resetPasswordSchema.parse(data);
  }
}
