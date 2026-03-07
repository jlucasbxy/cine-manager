import {
  createUserSchema,
  emailSchema,
  loginSchema,
  passwordZodSchema,
  resetPasswordSchema as basePasswordResetSchema
} from "@repo/validators";
import { z } from "zod";

export type LoginFormData = z.infer<typeof loginSchema>;

export { loginSchema };

export const registerSchema = createUserSchema
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

export const passwordResetSchema = basePasswordResetSchema
  .extend({
    confirmPassword: z.string().min(1, "Confirm your password")
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

export const profileSchema = createUserSchema
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
