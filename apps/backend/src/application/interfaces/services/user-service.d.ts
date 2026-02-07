import type { CreateUserDTO, UserDTO } from "@repo/dtos";

export interface UserService {
  createUser(input: CreateUserDTO): Promise<UserDTO>;
}
