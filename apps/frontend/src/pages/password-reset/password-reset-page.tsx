import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import { AuthFormLayout } from "@/components/auth/auth-form-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PasswordResetFormData } from "@/lib/schemas";
import { passwordResetSchema } from "@/lib/schemas";
import * as authService from "@/services/auth.service";

export function PasswordResetPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: { token }
  });

  const onSubmit = async (data: PasswordResetFormData) => {
    setIsSubmitting(true);
    try {
      await authService.resetPassword(data.token, data.newPassword);
      setDone(true);
      toast.success("Password reset successfully!");
    } catch {
      toast.error("Invalid or expired reset token");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (done) {
    return (
      <AuthFormLayout
        title="Password reset"
        description="Your password has been reset successfully"
      >
        <div className="text-center">
          <Link to="/login">
            <Button>Sign in</Button>
          </Link>
        </div>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout
      title="Set new password"
      description="Enter your new password"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="At least 8 characters"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-sm text-destructive">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Reset password
        </Button>
      </form>
    </AuthFormLayout>
  );
}
