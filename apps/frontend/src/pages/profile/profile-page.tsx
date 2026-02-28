import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { ProfileForm } from "@/components/profile/profile-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import type { ProfileFormData } from "@/lib/schemas";
import { getSignedUrl, uploadFile } from "@/services/upload.service";

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSubmit = async (
    data: ProfileFormData,
    pendingFile: File | null,
    avatarRemoved: boolean
  ) => {
    setIsSubmitting(true);
    try {
      const updateData: {
        name?: string;
        password?: string;
        avatarUrl?: string | null;
      } = {};
      if (data.name !== user?.name) updateData.name = data.name;
      if (data.password) updateData.password = data.password;

      if (pendingFile) {
        const { uploadUrl, fileUrl } = await getSignedUrl(
          pendingFile.name,
          pendingFile.type
        );
        await uploadFile(uploadUrl, pendingFile);
        updateData.avatarUrl = fileUrl;
      } else if (avatarRemoved) {
        updateData.avatarUrl = null;
      }

      if (Object.keys(updateData).length === 0) {
        toast.info("No changes to save");
        return;
      }

      await updateUser(updateData);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Member since {format(new Date(user.createdAt), "MMMM d, yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-sm text-muted-foreground">
            Email: {user.email}
          </div>
          <ProfileForm
            defaultName={user.name}
            avatarUrl={user.avatarUrl}
            initials={initials}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
