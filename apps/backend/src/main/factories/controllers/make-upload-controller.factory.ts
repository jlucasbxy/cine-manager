import { GenerateUploadUrlValidator } from "@repo/validators";
import { UploadController } from "@/infrastructure/http/controllers";
import { makeUploadService } from "@/main/factories/services";

export function makeUploadController(): UploadController {
  return new UploadController(
    makeUploadService(),
    new GenerateUploadUrlValidator()
  );
}
