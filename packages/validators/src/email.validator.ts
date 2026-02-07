import z from "zod";
import type { Validator } from "./validator";

export class EmailValidator implements Validator<{ email: string }> {
  private readonly emailSchema = z.object({
    email: z.email()
  });

  parse(data: unknown) {
    return this.emailSchema.parse(data);
  }
}
