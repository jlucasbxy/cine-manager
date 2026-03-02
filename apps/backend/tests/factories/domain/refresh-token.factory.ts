import { RefreshToken } from "@/domain/entities/refresh-token.entity";
import { Token, Uuid } from "@/domain/value-objects";

type RefreshTokenOverrides = Partial<{
  id: Uuid;
  token: string;
  userId: Uuid;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}>;

export function makeRefreshToken(
  overrides: RefreshTokenOverrides = {}
): RefreshToken {
  const defaultToken = "a".repeat(64);

  return RefreshToken.reconstitute({
    id: overrides.id ?? Uuid.generate(),
    token: Token.create(overrides.token ?? defaultToken),
    userId: overrides.userId ?? Uuid.generate(),
    expiresAt: overrides.expiresAt ?? new Date("2030-01-01T00:00:00.000Z"),
    revokedAt: overrides.revokedAt ?? null,
    createdAt: overrides.createdAt ?? new Date("2024-01-01T00:00:00.000Z")
  });
}
