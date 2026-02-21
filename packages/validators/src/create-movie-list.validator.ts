import type { CreateMovieListDTO } from "@repo/dtos";
import z from "zod";
import type { Validator } from "./validator";

export class CreateMovieListValidator implements Validator<CreateMovieListDTO> {
  private readonly schema = z.object({
    name: z.string().min(1).max(100)
  });

  parse(data: unknown): CreateMovieListDTO {
    return this.schema.parse(data);
  }
}
