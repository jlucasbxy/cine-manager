import { User } from "@/domain/entities";
import { Email } from "@/domain/value-objects/email.value-object";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt">;
type UpdateUserData = Partial<Omit<User, "id" | "createdAt" | "updatedAt">>;

export interface UserRepository {
  create(data: CreateUserData): Promise<User>;
  findByEmail(email: Email): Promise<User | null>;
  update(id: Uuid, data: UpdateUserData): Promise<User>;
  delete(id: Uuid): Promise<void>;
}
