import type { AddMovieToListDTO } from "@repo/dtos";
import z from "zod";
import type { Validator } from "./validator";

export class AddMovieToListValidator implements Validator<AddMovieToListDTO> {
  private readonly schema = z.object({
    movieId: z.uuidv7()
  });

  parse(data: unknown): AddMovieToListDTO {
    return this.schema.parse(data);
  }
}
