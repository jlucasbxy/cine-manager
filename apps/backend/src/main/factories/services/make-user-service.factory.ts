import { UserServiceImpl } from "@/infrastructure/services";
import {
  makeCreateUser,
  makeGetUser,
  makeUpdateUser
} from "@/main/factories/use-cases/user";
import { singleton } from "@/main/factories/singleton.util";

export const makeUserService = singleton(
  () => new UserServiceImpl(makeCreateUser(), makeGetUser(), makeUpdateUser())
);
