import type { UpdateUserDTO, UserDTO } from "@repo/dtos";
import type {
  HashProvider,
  TransactionManager
} from "@/application/interfaces/providers";
import { UserMapper } from "@/application/mappers";
import { OutboxEvent } from "@/domain/entities";
import { OutboxEventTypeEnum } from "@/domain/enums";
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

      const current = await repos.userRepository.findByIdForUpdate(id);
      if (!current) throw new UserNotFoundError();

      const updated = await repos.userRepository.update(id, {
        name: input.name,
        password: hashedPassword,
        avatarUrl: input.avatarUrl,
        updatedAt: new Date()
      });

      if (!updated) {
        throw new UserNotFoundError();
      }

      if (input.avatarUrl !== undefined && current.avatarUrl) {
        const key = current.avatarUrl.substring(
          current.avatarUrl.indexOf("uploads/")
        );
        await repos.outboxEventRepository.create(
          OutboxEvent.create({
            type: OutboxEventTypeEnum.STORAGE_FILE_DELETE,
            payload: { key }
          })
        );
      }

      return UserMapper.toDTO(updated);
    });
  }
}
