import { emailSchema } from "./email.schema";
import type { Validator } from "./validator";

export class EmailValidator implements Validator<{ email: string }> {
  parse(data: unknown) {
    return emailSchema.parse(data);
  }
}
