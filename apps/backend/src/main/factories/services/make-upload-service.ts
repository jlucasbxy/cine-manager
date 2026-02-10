import { UploadServiceImpl } from "@/infrastructure/services";
import { makeGenerateUploadUrl } from "@/main/factories/use-cases/upload";
import { singleton } from "@/main/factories/singleton";

export const makeUploadService = singleton(
  () => new UploadServiceImpl(makeGenerateUploadUrl())
);
