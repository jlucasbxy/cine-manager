import type { UpdateUserDTO, UserDTO } from "@repo/dtos";
import type {
  HashProvider,
  TransactionManager
} from "@/application/interfaces/providers";
import { UserMapper } from "@/application/mappers";
import { UserNotFoundError } from "@/domain/errors";
import { Password, Uuid } from "@/domain/value-objects";

export class UpdateUser {
  constructor(
    private readonly hashProvider: HashProvider,
    private readonly transactionManager: TransactionManager
  ) {}

  async execute(userId: string, input: UpdateUserDTO): Promise<UserDTO> {
    return this.transactionManager.execute(async (repos) => {
      const id = Uuid.create(userId);

      const hashedPassword = input.password
        ? Password.reconstitute(
            await this.hashProvider.hash(
              Password.create(input.password).toString()
            )
          )
        : undefined;

      const updated = await repos.userRepository.update(id, {
        name: input.name,
        password: hashedPassword,
        avatarUrl: input.avatarUrl,
        updatedAt: new Date()
      });

      if (!updated) {
        throw new UserNotFoundError();
      }

      return UserMapper.toDTO(updated);
    });
  }
}
