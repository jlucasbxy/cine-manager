import { Email } from "@/domain/value-objects/email.value-object";
import { Password } from "@/domain/value-objects/password.value-object";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

export class User {
  id: Uuid;
  name: string;
  email: Email;
  password: Password;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    id: Uuid;
    name: string;
    email: Email;
    password: Password;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
