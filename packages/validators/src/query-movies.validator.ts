import z from "zod";
import type { Validator } from "./validator";
import type { QueryMoviesDTO } from "@repo/dtos";

export class QueryMoviesValidator implements Validator<QueryMoviesDTO> {
  private readonly queryMoviesSchema = z.object({
    runtime: z.coerce.number().int().positive(),
    releaseDateStart: z.string().min(1),
    releaseDateEnd: z.string().min(1),
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(10)
  });

  parse(data: unknown) {
    return this.queryMoviesSchema.parse(data);
  }
}
