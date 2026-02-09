import { CreateUser } from "@/application/use-cases/user";
import { makeUserRepository } from "@/main/factories/repositories";
import { BcryptHashProvider } from "@/infrastructure/providers";

export function makeCreateUser(): CreateUser {
  return new CreateUser(
    makeUserRepository(),
    new BcryptHashProvider()
  );
}
