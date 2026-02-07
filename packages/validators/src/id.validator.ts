import z from "zod";
import type { Validator } from "./validator";

export class IdValidator implements Validator<{ id: string }, string> {
  private readonly idSchema = z.object({
    id: z.uuidv7()
  });

  parse(data: string) {
    return this.idSchema.parse(data);
  }
}
