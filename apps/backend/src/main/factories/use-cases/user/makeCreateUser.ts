import { CreateUser } from "@/application/use-cases/user";
import { PrismaUserRepository } from "@/infra/database/repositories";
import { BcryptHashProvider } from "@/infra/providers";

export function makeCreateUser(): CreateUser {
  return new CreateUser(
    new PrismaUserRepository(),
    new BcryptHashProvider()
  );
}
