import z from "zod";
import type { Validator } from "./validator";
import type { QueryMoviesDTO } from "@repo/dtos";
import { AgeRating, MovieStatus } from "./enums";

export class QueryMoviesValidator implements Validator<QueryMoviesDTO> {
  private readonly queryMoviesSchema = z.object({
    runtime: z.coerce.number().int().positive().optional(),
    releaseDateStart: z.string().min(1).optional(),
    releaseDateEnd: z.string().min(1).optional(),
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(10),
    status: z.nativeEnum(MovieStatus).optional(),
    ageRating: z.nativeEnum(AgeRating).optional(),
    search: z.string().min(1).optional()
  });

  parse(data: unknown) {
    return this.queryMoviesSchema.parse(data);
  }
}
