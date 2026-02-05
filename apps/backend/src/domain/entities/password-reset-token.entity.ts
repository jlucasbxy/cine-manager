import { Token, Uuid } from "@/domain/value-objects";

interface CreatePasswordResetTokenProps {
  userId: Uuid;
  expiresAt: Date;
}

interface ReconstitutePasswordResetTokenProps {
  id: Uuid;
  token: Token;
  userId: Uuid;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}

export class PasswordResetToken {
  readonly id: Uuid;
  readonly token: Token;
  readonly userId: Uuid;
  readonly expiresAt: Date;
  readonly usedAt: Date | null;
  readonly createdAt: Date;

  private constructor(data: {
    id: Uuid;
    token: Token;
    userId: Uuid;
    expiresAt: Date;
    usedAt: Date | null;
    createdAt: Date;
  }) {
    this.id = data.id;
    this.token = data.token;
    this.userId = data.userId;
    this.expiresAt = data.expiresAt;
    this.usedAt = data.usedAt;
    this.createdAt = data.createdAt;
  }

  static create(props: CreatePasswordResetTokenProps): PasswordResetToken {
    return new PasswordResetToken({
      id: Uuid.generate(),
      token: Token.generate(),
      userId: props.userId,
      expiresAt: props.expiresAt,
      usedAt: null,
      createdAt: new Date()
    });
  }

  static reconstitute(props: ReconstitutePasswordResetTokenProps): PasswordResetToken {
    return new PasswordResetToken({
      id: props.id,
      token: props.token,
      userId: props.userId,
      expiresAt: props.expiresAt,
      usedAt: props.usedAt,
      createdAt: props.createdAt
    });
  }

  isExpired(): boolean {
    return this.expiresAt < new Date();
  }

  isUsed(): boolean {
    return this.usedAt !== null;
  }

  isValid(): boolean {
    return !this.isExpired() && !this.isUsed();
  }

  markAsUsed(): PasswordResetToken {
    return new PasswordResetToken({
      id: this.id,
      token: this.token,
      userId: this.userId,
      expiresAt: this.expiresAt,
      usedAt: new Date(),
      createdAt: this.createdAt
    });
  }
}
