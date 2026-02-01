import z from "zod";

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email().optional(),
  password: z.string().min(8).optional(),
});

export class CreateUserDTO {
  readonly name: string;
  readonly email: string;
  readonly password: string;

  constructor(data: unknown) {
    const parsed = createUserSchema.parse(data);
    this.name = parsed.name;
    this.email = parsed.email;
    this.password = parsed.password;
  }
}

export class UpdateUserDTO {
  readonly name?: string;
  readonly email?: string;
  readonly password?: string;

  constructor(data: unknown) {
    const parsed = updateUserSchema.parse(data);
    this.name = parsed.name;
    this.email = parsed.email;
    this.password = parsed.password;
  }
}
