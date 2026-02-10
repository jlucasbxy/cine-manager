import { GenerateUploadUrl } from "@/application/use-cases/upload";
import { makeStorageProvider } from "@/main/factories/providers";
import { s3Env } from "@/infrastructure/config/s3-env";

export function makeGenerateUploadUrl(): GenerateUploadUrl {
  return new GenerateUploadUrl(
    makeStorageProvider(),
    s3Env.UPLOAD_URL_EXPIRES_IN
  );
}
