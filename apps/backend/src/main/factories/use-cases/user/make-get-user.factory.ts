import { GetUser } from "@/application/use-cases/user";
import { makeUserRepository } from "@/main/factories/repositories";

export function makeGetUser(): GetUser {
  return new GetUser(makeUserRepository());
}
