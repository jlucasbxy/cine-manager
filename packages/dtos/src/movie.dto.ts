import type { z } from "zod";
import type { createMovieSchema, updateMovieSchema } from "@repo/validators";

export type CreateMovieDTO = z.infer<typeof createMovieSchema>;
export type UpdateMovieDTO = z.infer<typeof updateMovieSchema>;
