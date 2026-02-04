import { User } from "@/domain/entities";
import { Email } from "@/domain/value-objects/email.value-object";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

export interface UserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: Email): Promise<User | null>;
  delete(id: Uuid): Promise<void>;
}
