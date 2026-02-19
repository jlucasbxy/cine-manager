import { User } from "@/domain/entities";
import { Email, Password, Uuid } from "@/domain/value-objects";
import type { UserModel } from "@/infrastructure/database/prisma/generated/prisma/models/User";

export class PrismaUserMapper {
  static toDomain(raw: UserModel): User {
    return User.reconstitute({
      id: Uuid.reconstitute(raw.id),
      name: raw.name,
      email: Email.reconstitute(raw.email),
      password: Password.reconstitute(raw.password),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    });
  }
}
