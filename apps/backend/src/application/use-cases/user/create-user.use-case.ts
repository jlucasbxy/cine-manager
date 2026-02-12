import { User } from "@/domain/entities";
import { Email, Password } from "@/domain/value-objects";
import { EmailAlreadyInUseError } from "@/domain/errors";
import type { UserRepository } from "@/application/interfaces/repositories";
import type { HashProvider } from "@/application/interfaces/providers";
import { UserMapper } from "@/application/mappers";
import type { CreateUserDTO, UserDTO } from "@repo/dtos";

export class CreateUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: HashProvider
  ) {}

  async execute(input: CreateUserDTO): Promise<UserDTO> {
    const email = Email.create(input.email);
    const password = Password.create(input.password);
    const user = User.create({ name: input.name, email, password });

    const hashedPassword = Password.reconstitute(
      await this.hashProvider.hash(password.toString())
    );

    const created = await this.userRepository.create(
      User.reconstitute({
        id: user.id,
        name: user.name,
        email: user.email,
        password: hashedPassword,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      })
    );

    if (!created) {
      throw new EmailAlreadyInUseError();
    }

    return UserMapper.toDTO(created);
  }
}
