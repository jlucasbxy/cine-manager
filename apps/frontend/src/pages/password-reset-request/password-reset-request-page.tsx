import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";
import { AuthFormLayout } from "@/components/auth/auth-form-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PasswordResetRequestFormData } from "@/lib/schemas";
import { passwordResetRequestSchema } from "@/lib/schemas";
import * as authService from "@/services/auth.service";

export function PasswordResetRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PasswordResetRequestFormData>({
    resolver: zodResolver(passwordResetRequestSchema)
  });

  const onSubmit = async (data: PasswordResetRequestFormData) => {
    setIsSubmitting(true);
    try {
      await authService.requestPasswordReset(data.email);
      setSent(true);
      toast.success("Check your email for reset instructions");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return (
      <AuthFormLayout
        title="Check your email"
        description="We've sent password reset instructions to your email"
      >
        <div className="text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            If you don&apos;t see the email, check your spam folder.
          </p>
          <Link to="/login">
            <Button variant="outline">Back to login</Button>
          </Link>
        </div>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout
      title="Reset password"
      description="Enter your email to receive reset instructions"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send reset link
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link
            to="/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Back to login
          </Link>
        </p>
      </form>
    </AuthFormLayout>
  );
}
