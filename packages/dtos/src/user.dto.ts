import type { z } from "zod";
import type { createUserSchema, updateUserSchema } from "@repo/validators";

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
