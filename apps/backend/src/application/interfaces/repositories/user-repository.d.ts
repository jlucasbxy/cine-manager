import { User } from "@/domain/entities";
import { Email, Password, Uuid } from "@/domain/value-objects";

export interface UserRepository {
  create(user: User): Promise<User>;
  findById(id: Uuid): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  updatePassword(id: Uuid, password: Password): Promise<void>;
  delete(id: Uuid): Promise<void>;
}
