import { User } from "@/domain/entities/user.entity";
import { Email, Password, Uuid } from "@/domain/value-objects";

type UserOverrides = Partial<{
  id: Uuid;
  name: string;
  email: string;
  password: string;
  avatarUrl: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}>;

export function makeUser(overrides: UserOverrides = {}): User {
  return User.reconstitute({
    id: overrides.id ?? Uuid.generate(),
    name: overrides.name ?? "John Doe",
    email: Email.reconstitute(overrides.email ?? "john@example.com"),
    password: Password.reconstitute(overrides.password ?? "hashed-password"),
    avatarUrl: overrides.avatarUrl,
    createdAt: overrides.createdAt ?? new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: overrides.updatedAt ?? new Date("2024-01-01T00:00:00.000Z")
  });
}
