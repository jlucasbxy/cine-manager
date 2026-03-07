import type { ResetPasswordDTO } from "@repo/dtos";
import { resetPasswordSchema } from "./reset-password.schema";
import type { Validator } from "./validator";

export class ResetPasswordValidator implements Validator<ResetPasswordDTO> {
  parse(data: unknown) {
    return resetPasswordSchema.parse(data);
  }
}
