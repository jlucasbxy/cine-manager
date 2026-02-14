import { User } from "@/domain/entities";
import { Email, Uuid } from "@/domain/value-objects";
import { Pick } from "@prisma/client/runtime/client";

export type UpdateUserData = Partial<Pick<User, "password">>;

export interface UserRepository {
  create(user: User): Promise<User | null>;
  findById(id: Uuid): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  existsByEmail(email: Email): Promise<Uuid | null>;
  updateById(id: Uuid, data: UpdateUserData): Promise<void>;
  delete(id: Uuid): Promise<void>;
}
