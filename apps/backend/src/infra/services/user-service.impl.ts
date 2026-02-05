import type { User } from "@/domain/entities";
import type { UserService } from "@/application/interfaces/services";
import type { CreateUser } from "@/application/use-cases/user";
import type { CreateUserDTO } from "@repo/dtos";

export class UserServiceImpl implements UserService {
  constructor(
    private readonly createUserUseCase: CreateUser
  ) {}

  async createUser(input: CreateUserDTO): Promise<User> {
    return this.createUserUseCase.execute(input);
  }
}
