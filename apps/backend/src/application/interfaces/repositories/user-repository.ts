import { User } from "@/domain/entities";
import { Email } from "@/domain/value-objects/email.value-object";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

export interface UserRepository {
  create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  findById(id: Uuid): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: Uuid, data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>): Promise<User>;
  delete(id: Uuid): Promise<void>;
}
