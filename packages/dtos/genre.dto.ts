import z from "zod";

const createGenreSchema = z.object({
  name: z.string().min(1),
});

const updateGenreSchema = z.object({
  name: z.string().min(1).optional(),
});

export class CreateGenreDTO {
  readonly name: string;

  constructor(data: unknown) {
    const parsed = createGenreSchema.parse(data);
    this.name = parsed.name;
  }
}

export class UpdateGenreDTO {
  readonly name?: string;

  constructor(data: unknown) {
    const parsed = updateGenreSchema.parse(data);
    this.name = parsed.name;
  }
}
