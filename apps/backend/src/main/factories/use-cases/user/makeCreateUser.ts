import { CreateUser } from "@/application/use-cases/user";
import { makeUserRepository } from "@/main/factories/repositories";
import { makeHashProvider } from "@/main/factories/providers";

export function makeCreateUser(): CreateUser {
  return new CreateUser(makeUserRepository(), makeHashProvider());
}
