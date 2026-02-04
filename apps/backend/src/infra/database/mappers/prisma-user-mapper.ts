import type { UserModel } from "../prisma/generated/prisma/models/User";
import { User } from "@/domain/entities";

export class PrismaUserMapper {
  static toDomain(raw: UserModel): User {
    return User.reconstitute({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      password: raw.password,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    });
  }
}
