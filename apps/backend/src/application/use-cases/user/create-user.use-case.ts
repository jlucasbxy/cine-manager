import { NotificationOutbox, User } from "@/domain/entities";
import { NotificationTypeEnum } from "@/domain/enums";
import { Email, Password } from "@/domain/value-objects";
import { EmailAlreadyInUseError } from "@/domain/errors";
import type {
  HashProvider,
  TransactionManager
} from "@/application/interfaces/providers";
import { UserMapper } from "@/application/mappers";
import type { CreateUserDTO, UserDTO } from "@repo/dtos";

export class CreateUser {
  constructor(
    private readonly hashProvider: HashProvider,
    private readonly transactionManager: TransactionManager
  ) {}

  async execute(input: CreateUserDTO): Promise<UserDTO> {
    const email = Email.create(input.email);
    const password = Password.create(input.password);
    const user = User.create({ name: input.name, email, password });

    const hashedPassword = Password.reconstitute(
      await this.hashProvider.hash(password.toString())
    );

    const created = await this.transactionManager.execute(async (repos) => {
      const savedUser = await repos.userRepository.create(
        User.reconstitute({
          id: user.id,
          name: user.name,
          email: user.email,
          password: hashedPassword,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        })
      );

      if (!savedUser) {
        throw new EmailAlreadyInUseError();
      }

      await repos.notificationOutboxRepository.create(
        NotificationOutbox.create({
          type: NotificationTypeEnum.WELCOME_EMAIL,
          payload: { to: email.toString() }
        })
      );

      return savedUser;
    });

    return UserMapper.toDTO(created);
  }
}
