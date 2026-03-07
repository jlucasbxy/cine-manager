import z from "zod";
import { passwordZodSchema } from "./schemas/password.schema";

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: passwordZodSchema
});
