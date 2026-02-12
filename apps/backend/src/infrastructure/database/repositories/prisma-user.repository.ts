import type { UserRepository } from "@/application/interfaces/repositories";
import { User } from "@/domain/entities";
import { Email, Password, Uuid } from "@/domain/value-objects";
import type { PrismaDatabase } from "@/infrastructure/database/prisma";
import { PrismaUserMapper } from "@/infrastructure/database/mappers";

export class PrismaUserRepository implements UserRepository {
  private readonly db: PrismaDatabase;

  constructor(client: PrismaDatabase) {
    this.db = client;
  }

  async create(user: User): Promise<User> {
    const raw = await this.db.user.create({
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
    const raw = await this.db.user.findUnique({
      where: { id: id.toString() }
    });
    if (!raw) return null;
    return PrismaUserMapper.toDomain(raw);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const raw = await this.db.user.findUnique({
      where: { email: email.toString() }
    });
    if (!raw) return null;
    return PrismaUserMapper.toDomain(raw);
  }

  async updatePassword(id: Uuid, password: Password): Promise<void> {
    await this.db.user.update({
      where: { id: id.toString() },
      data: { password: password.toString() }
    });
  }

  async delete(id: Uuid): Promise<void> {
    await this.db.user.delete({
      where: { id: id.toString() }
    });
  }
}
