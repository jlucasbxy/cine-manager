import type { UserModel } from "../prisma/generated/prisma/models/User";
import { User } from "@/domain/entities";
import { Email } from "@/domain/value-objects/email.value-object";
import { Password } from "@/domain/value-objects/password.value-object";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

export class PrismaUserMapper {
  static toDomain(raw: UserModel): User {
    return new User({
      id: new Uuid(raw.id),
      name: raw.name,
      email: new Email(raw.email),
      password: new Password(raw.password),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    });
  }
}
