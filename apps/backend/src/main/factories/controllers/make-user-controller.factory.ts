import { CreateUserValidator, UpdateUserValidator } from "@repo/validators";
import { UserController } from "@/infrastructure/http/controllers";
import { makeUserService } from "@/main/factories/services";

export function makeUserController(): UserController {
  return new UserController(
    makeUserService(),
    new CreateUserValidator(),
    new UpdateUserValidator()
  );
}
