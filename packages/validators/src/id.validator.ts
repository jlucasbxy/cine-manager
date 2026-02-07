import z from "zod";
import type { Validator } from "./validator";

export class IdValidator implements Validator<{ id: string }, unknown> {
  private readonly idSchema = z.object({
    id: z.uuidv7()
  });

  parse(data: unknown) {
    return this.idSchema.parse(data);
  }
}
