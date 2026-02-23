import type {
  RefreshTokenRepository,
  UpdateRefreshTokenData
} from "@/application/interfaces/repositories";
import type { RefreshToken } from "@/domain/entities";
import type { Token, Uuid } from "@/domain/value-objects";
import { PrismaRefreshTokenMapper } from "@/infrastructure/database/mappers";
import type { PrismaDatabase } from "@/infrastructure/database/prisma";
import type { RefreshTokenModel } from "@/infrastructure/database/prisma/generated/prisma/models/RefreshToken";

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

  async findByToken(token: Token): Promise<RefreshToken | null> {
    const raw = await this.db.refreshToken.findUnique({
      where: { token: token.toString() }
    });
    if (!raw) return null;
    return PrismaRefreshTokenMapper.toDomain(raw);
  }

  async findByTokenForUpdate(token: Token): Promise<RefreshToken | null> {
    const results = await this.db.$queryRaw<RefreshTokenModel[]>`
      SELECT * FROM "RefreshToken" WHERE token = ${token.toString()} FOR UPDATE
    `;
    if (!results[0]) return null;
    return PrismaRefreshTokenMapper.toDomain(results[0]);
  }

  async updateByToken(
    token: Token,
    data: UpdateRefreshTokenData
  ): Promise<RefreshToken | null> {
    try {
      const raw = await this.db.refreshToken.update({
        where: { token: token.toString() },
        data: { revokedAt: data.revokedAt }
      });
      return PrismaRefreshTokenMapper.toDomain(raw);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        "code" in error &&
        (error as { code: string }).code === "P2025"
      ) {
        return null;
      }
      throw error;
    }
  }

  async updateManyByUserId(
    userId: Uuid,
    data: UpdateRefreshTokenData
  ): Promise<number | null> {
    const result = await this.db.refreshToken.updateMany({
      where: { userId: userId.toString() },
      data: { revokedAt: data.revokedAt }
    });
    return result.count === 0 ? null : result.count;
  }

  async deleteExpired(): Promise<void> {
    await this.db.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    });
  }
}
