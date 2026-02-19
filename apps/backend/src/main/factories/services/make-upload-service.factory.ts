import { UploadServiceImpl } from "@/infrastructure/services";
import { singleton } from "@/main/factories/singleton.util";
import { makeGenerateUploadUrl } from "@/main/factories/use-cases/upload";

export const makeUploadService = singleton(
  () => new UploadServiceImpl(makeGenerateUploadUrl())
);
