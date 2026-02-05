import { User } from "@/domain/entities";
import { Email, Uuid } from "@/domain/value-objects";

export interface UserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: Email): Promise<User | null>;
  delete(id: Uuid): Promise<void>;
}
