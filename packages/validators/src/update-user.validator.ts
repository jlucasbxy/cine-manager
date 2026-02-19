import type { UpdateUserDTO } from "@repo/dtos";
import z from "zod";
import { passwordZodSchema } from "./schemas/password.schema";
import type { Validator } from "./validator";

export class UpdateUserValidator implements Validator<UpdateUserDTO> {
  private readonly updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    password: passwordZodSchema.optional(),
    avatarUrl: z.url().nullish()
  });

  parse(data: unknown) {
    return this.updateUserSchema.parse(data);
  }
}
