import type { RateMovieDTO } from "@repo/dtos";
import z from "zod";
import type { Validator } from "./validator";

export class RateMovieValidator implements Validator<RateMovieDTO> {
  private readonly schema = z.object({
    value: z.number().int().min(1).max(10)
  });

  parse(data: unknown): RateMovieDTO {
    return this.schema.parse(data);
  }
}
