import { Email } from "@/domain/value-objects/email.value-object";
import { Password } from "@/domain/value-objects/password.value-object";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}

interface ReconstituteUserProps {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  id: Uuid;
  name: string;
  email: Email;
  password: Password;
  createdAt: Date;
  updatedAt: Date;

  private constructor(data: {
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

  static create(props: CreateUserProps): User {
    const now = new Date();
    return new User({
      id: Uuid.generate(),
      name: props.name,
      email: new Email(props.email),
      password: Password.create(props.password),
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: ReconstituteUserProps): User {
    return new User({
      id: new Uuid(props.id),
      name: props.name,
      email: new Email(props.email),
      password: Password.fromHash(props.password),
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }
}
