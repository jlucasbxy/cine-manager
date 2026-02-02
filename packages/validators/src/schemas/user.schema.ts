import z from "zod";
import type { Validator } from "../interfaces/validator";
import type { CreateUserDTO, UpdateUserDTO } from "@repo/dtos";

export class CreateUserValidator implements Validator<CreateUserDTO> {
  private readonly createUserSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(8)
  });

  parse(data: Record<string, unknown>) {
    return this.createUserSchema.safeParse(data);
  }
}

export class UpdateUserValidator implements Validator<UpdateUserDTO> {
  private readonly updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.email().optional(),
    password: z.string().min(8).optional()
  });

  parse(data: Record<string, unknown>) {
    return this.updateUserSchema.safeParse(data);
  }
}
