import type { ResetPasswordDTO } from "@repo/dtos";
import z from "zod";
import { passwordZodSchema } from "./schemas/password.schema";
import type { Validator } from "./validator";

export class ResetPasswordValidator implements Validator<ResetPasswordDTO> {
  private readonly resetPasswordSchema = z.object({
    token: z.string().min(1),
    newPassword: passwordZodSchema
  });

  parse(data: unknown) {
    return this.resetPasswordSchema.parse(data);
  }
}
