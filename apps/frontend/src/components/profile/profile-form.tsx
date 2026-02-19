import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { ProfileFormData } from "@/lib/schemas";
import { profileSchema } from "@/lib/schemas";
import { getSignedUrl, uploadFile } from "@/services/upload.service";

interface ProfileFormProps {
  defaultName: string;
  avatarUrl?: string | null;
  initials?: string;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  onAvatarChange: (avatarUrl: string | null) => Promise<void>;
  isSubmitting: boolean;
}

export function ProfileForm({
  defaultName,
  avatarUrl,
  initials,
  onSubmit,
  onAvatarChange,
  isSubmitting
}: ProfileFormProps) {
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(
    avatarUrl ?? null
  );
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: defaultName,
      password: "",
      confirmPassword: ""
    }
  });

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const { uploadUrl, fileUrl } = await getSignedUrl(file.name, file.type);
      await uploadFile(uploadUrl, file);
      setCurrentAvatarUrl(fileUrl);
      await onAvatarChange(fileUrl);
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRemoveAvatar() {
    setIsUploadingAvatar(true);
    try {
      await onAvatarChange(null);
      setCurrentAvatarUrl(null);
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={currentAvatarUrl ?? undefined} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          {isUploadingAvatar && (
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
            disabled={isUploadingAvatar}
            onClick={() => fileInputRef.current?.click()}
          >
            Change avatar
          </Button>
          {currentAvatarUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isUploadingAvatar}
              onClick={() => void handleRemoveAvatar()}
            >
              Remove avatar
            </Button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void handleFileChange(e)}
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
