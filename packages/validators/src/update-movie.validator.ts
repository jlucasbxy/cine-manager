import type { UpdateMovieDTO } from "@repo/dtos";
import z from "zod";
import { movieSchema } from "./schemas/movie.schema";
import type { Validator } from "./validator";

export class UpdateMovieValidator implements Validator<UpdateMovieDTO> {
  private readonly updateMovieSchema = movieSchema.partial().extend({
    genres: z.array(z.uuidv7()).optional()
  });

  parse(data: unknown) {
    return this.updateMovieSchema.parse(data);
  }
}
