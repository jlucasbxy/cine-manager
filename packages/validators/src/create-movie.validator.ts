import z from "zod";
import { movieSchema } from "./schemas/movie.schema";
import type { Validator } from "./validator";
import type { CreateMovieDTO } from "@repo/dtos";

export class CreateMovieValidator implements Validator<CreateMovieDTO> {
  private readonly createMovieSchema = movieSchema.extend({
    userId: z.string().min(1),
    genres: z.array(z.uuidv7()).optional()
  });

  parse(data: unknown) {
    return this.createMovieSchema.parse(data);
  }
}
