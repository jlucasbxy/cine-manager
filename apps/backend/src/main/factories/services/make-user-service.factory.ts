import { UserServiceImpl } from "@/infrastructure/services";
import { singleton } from "@/main/factories/singleton.util";
import {
  makeCreateUser,
  makeGetUser,
  makeUpdateUser
} from "@/main/factories/use-cases/user";

export const makeUserService = singleton(
  () => new UserServiceImpl(makeCreateUser(), makeGetUser(), makeUpdateUser())
);
