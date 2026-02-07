import z from "zod";
import type { Validator } from "./validator";

export class IdValidator implements Validator<{ id: string }, string> {
  private readonly idSchema = z.uuidv7();

  parse(data: string) {
    return { id: this.idSchema.parse(data) };
  }
}
