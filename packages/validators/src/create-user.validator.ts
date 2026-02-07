import z from "zod";
import type { Validator } from "./validator";
import type { CreateUserDTO } from "@repo/dtos";
import { passwordZodSchema } from "./schemas/password.schema";

export class CreateUserValidator implements Validator<CreateUserDTO> {
  private readonly createUserSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: passwordZodSchema
  });

  parse(data: unknown) {
    return this.createUserSchema.parse(data);
  }
}
