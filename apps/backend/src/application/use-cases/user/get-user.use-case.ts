import type { UserDTO } from "@repo/dtos";
import type { UserRepository } from "@/application/interfaces/repositories";
import { UserMapper } from "@/application/mappers";
import { UserNotFoundError } from "@/domain/errors";
import { Uuid } from "@/domain/value-objects";

export class GetUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<UserDTO> {
    const id = Uuid.create(userId);
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return UserMapper.toDTO(user);
  }
}
