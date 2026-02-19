import { User } from "@/domain/entities";
import { Email, Uuid } from "@/domain/value-objects";
import { Pick } from "@prisma/client/runtime/client";

export type UpdateUserData = Partial<Pick<User, "name" | "password">> &
  { avatarUrl?: string | null } &
  Pick<User, "updatedAt">;

export interface UserRepository {
  create(user: User): Promise<User | null>;
  findById(id: Uuid): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  existsByEmail(email: Email): Promise<Uuid | null>;
  update(id: Uuid, data: UpdateUserData): Promise<User | null>;
  delete(id: Uuid): Promise<void>;
}
