import type { UserRepository } from "@/application/interfaces/repositories";
import { User } from "@/domain/entities";
import { Email, Password, Uuid } from "@/domain/value-objects";
import { prisma } from "@/infra/database/prisma";
import { PrismaUserMapper } from "@/infra/database/mappers";

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

  async findById(id: Uuid): Promise<User | null> {
    const raw = await prisma.user.findUnique({
      where: { id: id.toString() }
    });
    if (!raw) return null;
    return PrismaUserMapper.toDomain(raw);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const raw = await prisma.user.findUnique({
      where: { email: email.toString() }
    });
    if (!raw) return null;
    return PrismaUserMapper.toDomain(raw);
  }

  async updatePassword(id: Uuid, password: Password): Promise<void> {
    await prisma.user.update({
      where: { id: id.toString() },
      data: { password: password.toString() }
    });
  }

  async delete(id: Uuid): Promise<void> {
    await prisma.user.delete({
      where: { id: id.toString() }
    });
  }
}
