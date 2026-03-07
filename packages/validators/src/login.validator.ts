import type { LoginDTO } from "@repo/dtos";
import { loginSchema } from "./login.schema";
import type { Validator } from "./validator";

export class LoginValidator implements Validator<LoginDTO> {
  parse(data: unknown) {
    return loginSchema.parse(data);
  }
}
