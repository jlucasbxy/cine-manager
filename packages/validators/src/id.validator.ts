import z from "zod";
import type { Validator } from "./validator";
import { idZodSchema } from "./schemas/id.schema";

export class IdValidator implements Validator<string> {
  private readonly idSchema = z.object({
    id: idZodSchema
  });

  parse(data: unknown) {
    return this.idSchema.parse(data).id;
  }
}
