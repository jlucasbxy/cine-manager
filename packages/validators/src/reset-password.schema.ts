import z from "zod";
import { passwordZodSchema } from "./schemas/password.schema";

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: passwordZodSchema
});
