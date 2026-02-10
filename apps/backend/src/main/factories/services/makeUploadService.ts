import { UploadServiceImpl } from "@/infrastructure/services";
import { makeGenerateUploadUrl } from "@/main/factories/use-cases/upload";

export function makeUploadService(): UploadServiceImpl {
  return new UploadServiceImpl(makeGenerateUploadUrl());
}
