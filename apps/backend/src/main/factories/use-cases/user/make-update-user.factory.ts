import { UpdateUser } from "@/application/use-cases/user";
import { makeUserRepository } from "@/main/factories/repositories";
import { makeHashProvider } from "@/main/factories/providers";

export function makeUpdateUser(): UpdateUser {
	return new UpdateUser(makeUserRepository(), makeHashProvider());
}
