import type { RefreshTokenRepository, UpdateRefreshTokenData } from "@/application/interfaces/repositories";
import { RefreshToken } from "@/domain/entities";
import { Token, Uuid } from "@/domain/value-objects";
import type { PrismaDatabase } from "@/infrastructure/database/prisma";
import { PrismaRefreshTokenMapper } from "@/infrastructure/database/mappers";

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  private readonly db: PrismaDatabase;

  constructor(client: PrismaDatabase) {
    this.db = client;
  }

  async create(token: RefreshToken): Promise<RefreshToken> {
    const raw = await this.db.refreshToken.create({
      data: {
        id: token.id.toString(),
        token: token.token.toString(),
        userId: token.userId.toString(),
        expiresAt: token.expiresAt,
        revokedAt: token.revokedAt,
        createdAt: token.createdAt
      }
    });
    return PrismaRefreshTokenMapper.toDomain(raw);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const raw = await this.db.refreshToken.findUnique({
      where: { token }
    });
    if (!raw) return null;
    return PrismaRefreshTokenMapper.toDomain(raw);
  }

  async update(token: RefreshToken): Promise<void> {
    await this.db.refreshToken.update({
      where: { id: token.id.toString() },
      data: { revokedAt: token.revokedAt }
    });
  }

  async updateByToken(token: Token, data: UpdateRefreshTokenData): Promise<void> {
    await this.db.refreshToken.updateMany({
      where: { token: token.toString() },
      data
    });
  }

  async updateManyByUserId(userId: Uuid, data: UpdateRefreshTokenData): Promise<void> {
    await this.db.refreshToken.updateMany({
      where: { userId: userId.toString() },
      data
    });
  }

  async deleteExpired(): Promise<void> {
    await this.db.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    });
  }
}
