import { type Email, type Password, Uuid } from "@/domain/value-objects";

interface CreateUserProps {
  name: string;
  email: Email;
  password: Password;
}

interface ReconstituteUserProps {
  id: Uuid;
  name: string;
  email: Email;
  password: Password;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  readonly id: Uuid;
  readonly name: string;
  readonly email: Email;
  readonly password: Password;
  readonly createdAt: Date;
  readonly updatedAt: Date;

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
      email: props.email,
      password: props.password,
      createdAt: now,
      updatedAt: now
    });
  }

  static reconstitute(props: ReconstituteUserProps): User {
    return new User({
      id: props.id,
      name: props.name,
      email: props.email,
      password: props.password,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt
    });
  }
}
