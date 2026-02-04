import { User } from "@/domain/entities";
import { EmailAlreadyInUseError } from "@/domain/errors/email-already-in-use.error";
import { UserRepository } from "@/application/interfaces/repositories/user-repository";
import { HashProvider } from "@/application/interfaces/providers/hash-provider";
import { CreateUserDTO } from "@repo/dtos";

export class CreateUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: HashProvider
  ) { }

  async execute(input: CreateUserDTO): Promise<User> {
    const user = User.create(input);

    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new EmailAlreadyInUseError();
    }

    const hashedPassword = await this.hashProvider.hash(user.password.toString());

    return this.userRepository.create(
      User.reconstitute({
        id: user.id.toString(),
        name: user.name,
        email: user.email.toString(),
        password: hashedPassword,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      })
    );
  }
}
