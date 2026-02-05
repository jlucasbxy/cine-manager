import { Token, Uuid } from "@/domain/value-objects";

interface CreateRefreshTokenProps {
  userId: Uuid;
  expiresAt: Date;
}

interface ReconstituteRefreshTokenProps {
  id: Uuid;
  token: Token;
  userId: Uuid;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}

export class RefreshToken {
  readonly id: Uuid;
  readonly token: Token;
  readonly userId: Uuid;
  readonly expiresAt: Date;
  readonly revokedAt: Date | null;
  readonly createdAt: Date;

  private constructor(data: {
    id: Uuid;
    token: Token;
    userId: Uuid;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
  }) {
    this.id = data.id;
    this.token = data.token;
    this.userId = data.userId;
    this.expiresAt = data.expiresAt;
    this.revokedAt = data.revokedAt;
    this.createdAt = data.createdAt;
  }

  static create(props: CreateRefreshTokenProps): RefreshToken {
    return new RefreshToken({
      id: Uuid.generate(),
      token: Token.generate(),
      userId: props.userId,
      expiresAt: props.expiresAt,
      revokedAt: null,
      createdAt: new Date()
    });
  }

  static reconstitute(props: ReconstituteRefreshTokenProps): RefreshToken {
    return new RefreshToken({
      id: props.id,
      token: props.token,
      userId: props.userId,
      expiresAt: props.expiresAt,
      revokedAt: props.revokedAt,
      createdAt: props.createdAt
    });
  }

  isExpired(): boolean {
    return this.expiresAt < new Date();
  }

  isRevoked(): boolean {
    return this.revokedAt !== null;
  }

  isValid(): boolean {
    return !this.isExpired() && !this.isRevoked();
  }

  revoke(): RefreshToken {
    return new RefreshToken({
      id: this.id,
      token: this.token,
      userId: this.userId,
      expiresAt: this.expiresAt,
      revokedAt: new Date(),
      createdAt: this.createdAt
    });
  }
}
