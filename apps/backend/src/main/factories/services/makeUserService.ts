import { UserServiceImpl } from "@/infra/services";
import { makeCreateUser } from "@/main/factories/use-cases/user";

export function makeUserService(): UserServiceImpl {
  return new UserServiceImpl(
    makeCreateUser()
  );
}
