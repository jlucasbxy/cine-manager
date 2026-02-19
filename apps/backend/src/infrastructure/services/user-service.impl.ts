import type { CreateUserDTO, UpdateUserDTO, UserDTO } from "@repo/dtos";
import type { UserService } from "@/application/interfaces/services";
import type {
  CreateUser,
  GetUser,
  UpdateUser
} from "@/application/use-cases/user";

export class UserServiceImpl implements UserService {
  constructor(
    private readonly createUserUseCase: CreateUser,
    private readonly getUserUseCase: GetUser,
    private readonly updateUserUseCase: UpdateUser
  ) {}

  async createUser(input: CreateUserDTO): Promise<UserDTO> {
    return this.createUserUseCase.execute(input);
  }

  async getUser(userId: string): Promise<UserDTO> {
    return this.getUserUseCase.execute(userId);
  }

  async updateUser(userId: string, input: UpdateUserDTO): Promise<UserDTO> {
    return this.updateUserUseCase.execute(userId, input);
  }
}
