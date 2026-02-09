import { UserServiceImpl } from "@/infrastructure/services";
import { makeCreateUser } from "@/main/factories/use-cases/user";

export function makeUserService(): UserServiceImpl {
  return new UserServiceImpl(makeCreateUser());
}
