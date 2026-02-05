import type { UserModel } from "@/infra/database/prisma/generated/prisma/models/User";
import { User } from "@/domain/entities";
import { Email, Password, Uuid } from "@/domain/value-objects";

export class PrismaUserMapper {
  static toDomain(raw: UserModel): User {
    return User.reconstitute({
      id: Uuid.reconstitute(raw.id),
      name: raw.name,
      email: Email.reconstitute(raw.email),
      password: Password.fromHash(raw.password),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    });
  }
}
