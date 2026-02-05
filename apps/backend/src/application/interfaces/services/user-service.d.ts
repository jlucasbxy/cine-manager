import type { User } from "@/domain/entities";
import type { CreateUserDTO } from "@repo/dtos";

export interface UserService {
  createUser(input: CreateUserDTO): Promise<User>;
}
