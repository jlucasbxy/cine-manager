import { UserRepository } from "@/application/interfaces/repositories/user-repository";
import { User } from "@/domain/entities";
import { Email } from "@/domain/value-objects/email.value-object";
import { Uuid } from "@/domain/value-objects/uuid.value-object";
import { prisma } from "@/infra/database/prisma";
import { PrismaUserMapper } from "@/infra/database/mappers/prisma-user-mapper";

export class PrismaUserRepository implements UserRepository {
  async create(user: User): Promise<User> {
    const raw = await prisma.user.create({
      data: {
        id: user.id.toString(),
        name: user.name,
        email: user.email.toString(),
        password: user.password.toString()
      }
    });
    return PrismaUserMapper.toDomain(raw);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const raw = await prisma.user.findUnique({
      where: { email: email.toString() }
    });
    if (!raw) return null;
    return PrismaUserMapper.toDomain(raw);
  }

  async delete(id: Uuid): Promise<void> {
    await prisma.user.delete({
      where: { id: id.toString() }
    });
  }
}
