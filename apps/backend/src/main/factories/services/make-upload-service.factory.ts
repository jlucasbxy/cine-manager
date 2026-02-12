import { UploadServiceImpl } from "@/infrastructure/services";
import { makeGenerateUploadUrl } from "@/main/factories/use-cases/upload";
import { singleton } from "@/main/factories/singleton.util";

export const makeUploadService = singleton(
  () => new UploadServiceImpl(makeGenerateUploadUrl())
);
