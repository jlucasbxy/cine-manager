import z from "zod";
import type { Validator } from "./validator";
import type { QueryMoviesDTO } from "@repo/dtos";

export class QueryMoviesValidator implements Validator<QueryMoviesDTO, unknown> {
  private readonly queryMoviesSchema = z.object({
    runtime: z.coerce.number().int().positive(),
    releaseDateStart: z.string().min(1),
    releaseDateEnd: z.string().min(1)
  });

  parse(data: unknown) {
    return this.queryMoviesSchema.parse(data);
  }
}
