import { passwordZodSchema } from "@repo/validators";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: passwordZodSchema,
    confirmPassword: z.string().min(1, "Confirm your password")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const passwordResetRequestSchema = z.object({
  email: z.email("Invalid email address")
});

export type PasswordResetRequestFormData = z.infer<
  typeof passwordResetRequestSchema
>;

export const passwordResetSchema = z
  .object({
    token: z.string().min(1),
    newPassword: passwordZodSchema,
    confirmPassword: z.string().min(1, "Confirm your password")
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

export const profileSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
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
