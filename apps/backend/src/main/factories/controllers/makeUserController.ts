import { UserController } from "@/infrastructure/http/controllers";
import { CreateUserValidator } from "@repo/validators";
import { makeUserService } from "@/main/factories/services";

export function makeUserController(): UserController {
  return new UserController(
    makeUserService(),
    new CreateUserValidator()
  );
}
