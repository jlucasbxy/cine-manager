import { ImagePlus, Loader2, X } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as uploadService from "@/services/upload.service";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  aspectRatio?: string;
}

export function ImageUploadField({
  value,
  onChange,
  label,
  aspectRatio = "aspect-[2/3]"
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error("Only JPEG, PNG, and WebP images are allowed");
        return;
      }

      setIsUploading(true);
      try {
        const { uploadUrl, fileUrl } = await uploadService.getSignedUrl(
          file.name,
          file.type
        );
        await uploadService.uploadFile(uploadUrl, file);
        onChange(fileUrl);
        toast.success("Image uploaded");
      } catch {
        toast.error("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) void handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) void handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">{label}</span>
      {value ? (
        <div className={cn("relative overflow-hidden rounded-lg", aspectRatio)}>
          <img src={value} alt={label} className="h-full w-full object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={() => onChange("")}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <label
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
            aspectRatio,
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drop image here or click to upload
              </p>
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleInputChange}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}
