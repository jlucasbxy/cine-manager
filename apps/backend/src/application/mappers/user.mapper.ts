import type { UserDTO } from "@repo/dtos";
import type { User } from "@/domain/entities";

export const UserMapper = {
  toDTO(user: User): UserDTO {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email.toString(),
      avatarUrl: user.avatarUrl ?? null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }
};
