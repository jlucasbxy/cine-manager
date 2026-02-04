import { CreateUserData, UpdateUserData, UserRepository } from "@/application/interfaces/repositories/user-repository";
import { User } from "@/domain/entities";
import { Email } from "@/domain/value-objects/email.value-object";
import { Uuid } from "@/domain/value-objects/uuid.value-object";
import { prisma } from "@/infra/database/prisma";
import { PrismaUserMapper } from "@/infra/database/mappers/prisma-user-mapper";

export class PrismaUserRepository implements UserRepository {
  async create(data: CreateUserData): Promise<User> {
    const raw = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toString(),
        password: data.password.toString()
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

  async update(id: Uuid, data: UpdateUserData): Promise<User> {
    const prismaData: Record<string, unknown> = {};
    if (data.name !== undefined) prismaData.name = data.name;
    if (data.email !== undefined) prismaData.email = data.email.toString();
    if (data.password !== undefined) prismaData.password = data.password.toString();

    const raw = await prisma.user.update({
      where: { id: id.toString() },
      data: prismaData
    });
    return PrismaUserMapper.toDomain(raw);
  }

  async delete(id: Uuid): Promise<void> {
    await prisma.user.delete({
      where: { id: id.toString() }
    });
  }
}
