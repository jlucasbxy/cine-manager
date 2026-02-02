import z from "zod";
import type { Validator } from "../interfaces/validator";
import type { UpdateUserDTO } from "@repo/dtos";

export class UpdateUserValidator implements Validator<UpdateUserDTO> {
  private readonly updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.email().optional(),
    password: z.string().min(8).optional()
  });

  parse(data: Record<string, unknown>) {
    return this.updateUserSchema.parse(data);
  }
}
