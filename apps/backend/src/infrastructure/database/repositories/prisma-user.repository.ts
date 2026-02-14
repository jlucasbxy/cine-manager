import type { UserRepository } from "@/application/interfaces/repositories";
import type { User } from "@/domain/entities";
import { type Email, Uuid } from "@/domain/value-objects";
import type { PrismaDatabase } from "@/infrastructure/database/prisma";
import { PrismaUserMapper } from "@/infrastructure/database/mappers";
import type { UpdateUserData } from "@/application/interfaces/repositories/user-repository";

export class PrismaUserRepository implements UserRepository {
  private readonly db: PrismaDatabase;

  constructor(client: PrismaDatabase) {
    this.db = client;
  }

  async create(user: User): Promise<User | null> {
    try {
      const raw = await this.db.user.create({
        data: {
          id: user.id.toString(),
          name: user.name,
          email: user.email.toString(),
          password: user.password.toString()
        }
      });
      return PrismaUserMapper.toDomain(raw);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        return null;
      }
      throw error;
    }
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

  async existsByEmail(email: Email): Promise<Uuid | null> {
    const raw = await this.db.user.findUnique({
      where: { email: email.toString() },
      select: { id: true }
    });
    if (!raw) return null;
    return Uuid.create(raw.id);
  }

  async updateById(id: Uuid, data: UpdateUserData): Promise<void> {
    const updateData: Record<string, string | Date> = {
      updatedAt: data.updatedAt
    };
    if (data.name) updateData.name = data.name;
    if (data.password) updateData.password = data.password.toString();
    await this.db.user.update({
      where: { id: id.toString() },
      data: updateData
    });
  }

  async delete(id: Uuid): Promise<void> {
    await this.db.user.delete({
      where: { id: id.toString() }
    });
  }
}
