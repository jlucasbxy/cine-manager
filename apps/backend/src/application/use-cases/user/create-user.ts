import { User } from "@/domain/entities";
import { Email } from "@/domain/value-objects/email.value-object";
import { Password } from "@/domain/value-objects/password.value-object";
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
    const email = Email.create(input.email);
    const password = Password.create(input.password);
    const user = User.create({ name: input.name, email, password });

    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new EmailAlreadyInUseError();
    }

    const hashedPassword = Password.fromHash(
      await this.hashProvider.hash(password.toString())
    );

    return this.userRepository.create(
      User.reconstitute({
        id: user.id,
        name: user.name,
        email: user.email,
        password: hashedPassword,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      })
    );
  }
}
