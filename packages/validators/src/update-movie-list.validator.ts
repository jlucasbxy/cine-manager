import type { UpdateMovieListDTO } from "@repo/dtos";
import z from "zod";
import type { Validator } from "./validator";

export class UpdateMovieListValidator implements Validator<UpdateMovieListDTO> {
  private readonly schema = z.object({
    name: z.string().min(1).max(100)
  });

  parse(data: unknown): UpdateMovieListDTO {
    return this.schema.parse(data);
  }
}
