import type { QueryMoviesDTO } from "@repo/dtos";
import z from "zod";
import { AgeRating, MovieStatus } from "./enums";
import type { Validator } from "./validator";

export class QueryMoviesValidator implements Validator<QueryMoviesDTO> {
  private readonly queryMoviesSchema = z.object({
    runtime: z.coerce.number().int().positive().optional(),
    releaseDateStart: z.string().min(1).optional(),
    releaseDateEnd: z.string().min(1).optional(),
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(10),
    status: z.nativeEnum(MovieStatus).optional(),
    ageRating: z.nativeEnum(AgeRating).optional(),
    search: z.string().min(1).optional(),
    onlyMine: z.coerce.boolean().optional(),
    genreIds: z
      .union([z.string().uuid(), z.array(z.string().uuid())])
      .transform((val) => (Array.isArray(val) ? val : [val]))
      .optional()
  });

  parse(data: unknown) {
    return this.queryMoviesSchema.parse(data);
  }
}
