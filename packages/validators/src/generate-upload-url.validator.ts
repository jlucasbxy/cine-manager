import z from "zod";
import type { Validator } from "./validator";
import type { GenerateUploadUrlDTO } from "@repo/dtos";

export class GenerateUploadUrlValidator implements Validator<GenerateUploadUrlDTO> {
  private readonly generateUploadUrlSchema = z.object({
    fileName: z.string().min(1),
    contentType: z.enum(["image/jpeg", "image/png", "image/webp"])
  });

  parse(data: unknown) {
    return this.generateUploadUrlSchema.parse(data);
  }
}
