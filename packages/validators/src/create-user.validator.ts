import type { CreateUserDTO } from "@repo/dtos";
import { createUserSchema } from "./create-user.schema";
import type { Validator } from "./validator";

export class CreateUserValidator implements Validator<CreateUserDTO> {
  parse(data: unknown) {
    return createUserSchema.parse(data);
  }
}
