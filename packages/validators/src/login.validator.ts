import z from "zod";
import type { Validator } from "./validator";
import type { LoginDTO } from "@repo/dtos";

export class LoginValidator implements Validator<LoginDTO> {
  private readonly loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1)
  });

  parse(data: unknown) {
    return this.loginSchema.parse(data);
  }
}
