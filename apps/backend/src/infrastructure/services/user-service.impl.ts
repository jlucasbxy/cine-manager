import type { UserService } from "@/application/interfaces/services";
import type { CreateUser, UpdateUser } from "@/application/use-cases/user";
import type { CreateUserDTO, UpdateUserDTO, UserDTO } from "@repo/dtos";

export class UserServiceImpl implements UserService {
  constructor(
    private readonly createUserUseCase: CreateUser,
    private readonly updateUserUseCase: UpdateUser
  ) {}

  async createUser(input: CreateUserDTO): Promise<UserDTO> {
    return this.createUserUseCase.execute(input);
  }

  async updateUser(userId: string, input: UpdateUserDTO): Promise<UserDTO> {
    return this.updateUserUseCase.execute(userId, input);
  }
}
