import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ImageFile } from "@/components/ui/image-file";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";
import { Separator } from "@/components/ui/separator";
import { usePasswordStrength } from "@/hooks/use-password-strength";
import type { ProfileFormData } from "@/lib/schemas";
import { profileSchema } from "@/lib/schemas";

interface ProfileFormProps {
  defaultName: string;
  avatarUrl?: string | null;
  initials?: string;
  onSubmit: (
    data: ProfileFormData,
    pendingFile: File | null,
    avatarRemoved: boolean
  ) => Promise<void>;
  isSubmitting: boolean;
}

export function ProfileForm({
  defaultName,
  avatarUrl,
  initials,
  onSubmit,
  isSubmitting
}: ProfileFormProps) {
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: defaultName,
      password: "",
      confirmPassword: ""
    }
  });

  const passwordValue = watch("password") ?? "";
  const passwordStrength = usePasswordStrength(passwordValue);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setAvatarRemoved(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleRemoveAvatar() {
    setPendingFile(null);
    setAvatarRemoved(true);
  }

  async function handleFormSubmit(data: ProfileFormData) {
    await onSubmit(data, pendingFile, avatarRemoved);
    setPendingFile(null);
    setAvatarRemoved(false);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-20 w-20">
            {pendingFile ? (
              <ImageFile
                file={pendingFile}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <>
                <AvatarImage
                  src={avatarRemoved ? undefined : (avatarUrl ?? undefined)}
                />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </>
            )}
          </Avatar>
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={() => fileInputRef.current?.click()}
          >
            Change avatar
          </Button>
          {(pendingFile ?? (!avatarRemoved && avatarUrl)) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isSubmitting}
              onClick={handleRemoveAvatar}
            >
              Remove avatar
            </Button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <Separator />

      <div>
        <h3 className="mb-4 text-lg font-medium">Change Password</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Leave blank to keep your current password
        </p>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              {...register("password")}
            />
            <PasswordStrengthIndicator
              score={passwordStrength.score}
              feedback={passwordStrength.feedback}
              show={passwordValue.length > 0}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );
}
