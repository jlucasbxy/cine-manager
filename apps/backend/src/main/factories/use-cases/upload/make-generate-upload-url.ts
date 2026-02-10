import { GenerateUploadUrl } from "@/application/use-cases/upload";
import { makeStorageProvider } from "@/main/factories/providers";

export function makeGenerateUploadUrl(): GenerateUploadUrl {
  return new GenerateUploadUrl(makeStorageProvider());
}
