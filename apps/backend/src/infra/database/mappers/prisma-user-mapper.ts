import type { UserModel } from "@/infra/database/prisma/generated/prisma/models/User";
import { User } from "@/domain/entities";
import { Email } from "@/domain/value-objects/email.value-object";
import { Password } from "@/domain/value-objects/password.value-object";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

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
