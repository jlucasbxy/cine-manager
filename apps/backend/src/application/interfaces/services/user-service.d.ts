import type { CreateUserDTO, UpdateUserDTO, UserDTO } from "@repo/dtos";

export interface UserService {
  createUser(input: CreateUserDTO): Promise<UserDTO>;
  updateUser(userId: string, input: UpdateUserDTO): Promise<UserDTO>;
}
