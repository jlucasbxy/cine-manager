import z from "zod";
import type { Validator } from "../interfaces/validator";
import type { CreateUserDTO } from "@repo/dtos";

export class CreateUserValidator implements Validator<CreateUserDTO> {
  private readonly createUserSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(8)
  });

  parse(data: Record<string, unknown>) {
    return this.createUserSchema.parse(data);
  }
}
