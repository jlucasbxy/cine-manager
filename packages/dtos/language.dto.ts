import z from "zod";

const createLanguageSchema = z.object({
  code: z.string().length(2),
  name: z.string().min(1),
});

const updateLanguageSchema = z.object({
  code: z.string().length(2).optional(),
  name: z.string().min(1).optional(),
});

export class CreateLanguageDTO {
  readonly code: string;
  readonly name: string;

  constructor(data: unknown) {
    const parsed = createLanguageSchema.parse(data);
    this.code = parsed.code;
    this.name = parsed.name;
  }
}

export class UpdateLanguageDTO {
  readonly code?: string;
  readonly name?: string;

  constructor(data: unknown) {
    const parsed = updateLanguageSchema.parse(data);
    this.code = parsed.code;
    this.name = parsed.name;
  }
}
