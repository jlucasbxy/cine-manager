import z from "zod";
import { idZodSchema } from "./schemas/id.schema";
import type { Validator } from "./validator";

export class IdValidator implements Validator<string> {
  private readonly idSchema = z.object({
    id: idZodSchema
  });

  parse(data: unknown) {
    return this.idSchema.parse(data).id;
  }
}
