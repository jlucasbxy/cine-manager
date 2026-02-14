import { User } from "@/domain/entities";
import { Email, Password, Uuid } from "@/domain/value-objects";

export interface UpdateUserData {
  password?: Password;
}

export interface UserRepository {
  create(user: User): Promise<User | null>;
  findById(id: Uuid): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  updateById(id: Uuid, data: UpdateUserData): Promise<void>;
  delete(id: Uuid): Promise<void>;
}
