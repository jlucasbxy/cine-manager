import {
  emailSchema,
  type loginSchema,
  passwordZodSchema
} from "@repo/validators";
import { z } from "zod";

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .extend({
    confirmPassword: z.string().min(1, "Confirm your password")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const passwordResetRequestSchema = emailSchema;

export type PasswordResetRequestFormData = z.infer<
  typeof passwordResetRequestSchema
>;

export const passwordResetSchema = z
  .extend({
    confirmPassword: z.string().min(1, "Confirm your password")
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

export const profileSchema = z
  .pick({
    name: true
  })
  .extend({
    password: passwordZodSchema.or(z.literal("")),
    confirmPassword: z.string()
  })
  .refine(
    (data) => {
      if (data.password && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"]
    }
  );

export type ProfileFormData = z.infer<typeof profileSchema>;
