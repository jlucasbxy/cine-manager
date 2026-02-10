import { GenerateUploadUrl } from "@/application/use-cases/upload";
import { makeStorageProvider } from "@/main/factories/providers";
import { env } from "@/infrastructure/config/env";

export function makeGenerateUploadUrl(): GenerateUploadUrl {
  return new GenerateUploadUrl(
    makeStorageProvider(),
    env.UPLOAD_URL_EXPIRES_IN
  );
}
