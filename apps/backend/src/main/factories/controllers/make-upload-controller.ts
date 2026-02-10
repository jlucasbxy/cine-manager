import { UploadController } from "@/infrastructure/http/controllers";
import { GenerateUploadUrlValidator } from "@repo/validators";
import { makeUploadService } from "@/main/factories/services";

export function makeUploadController(): UploadController {
  return new UploadController(
    makeUploadService(),
    new GenerateUploadUrlValidator()
  );
}
