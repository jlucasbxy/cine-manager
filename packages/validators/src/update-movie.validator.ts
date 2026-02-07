import z from "zod";
import { movieSchema } from "./schemas/movie.schema";
import type { Validator } from "./validator";
import type { UpdateMovieDTO } from "@repo/dtos";

export class UpdateMovieValidator implements Validator<UpdateMovieDTO, unknown> {
  private readonly updateMovieSchema = movieSchema.partial().extend({
    genres: z.array(z.uuidv7()).optional()
  });

  parse(data: unknown) {
    return this.updateMovieSchema.parse(data);
  }
}
