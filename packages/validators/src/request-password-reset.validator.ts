import z from "zod";
import type { Validator } from "./validator";
import type { RequestPasswordResetDTO } from "@repo/dtos";

export class RequestPasswordResetValidator implements Validator<RequestPasswordResetDTO> {
  private readonly requestPasswordResetSchema = z.object({
    email: z.email()
  });

  parse(data: unknown) {
    return this.requestPasswordResetSchema.parse(data);
  }
}
