import { UploadKey } from "@/domain/value-objects";
import { ImageUpload } from "@/domain/entities";

export interface StorageProvider {
  generateUploadUrl(uploadKey: UploadKey): Promise<ImageUpload>;
}
