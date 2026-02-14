import z from "zod";
import type { Validator } from "./validator";
import type { UpdateUserDTO } from "@repo/dtos";
import { passwordZodSchema } from "./schemas/password.schema";

export class UpdateUserValidator implements Validator<UpdateUserDTO> {
	private readonly updateUserSchema = z.object({
		name: z.string().min(1).optional(),
		password: passwordZodSchema.optional()
	});

	parse(data: unknown) {
		return this.updateUserSchema.parse(data);
	}
}
