import { uuidv7 } from "uuidv7";
import z from "zod";
import { InvalidUuidError } from "@/domain/errors/invalid-uuid.error";

export class Uuid {

  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Uuid {
    const r = z.uuid().safeParse(value);
    if (!r.success) {
      throw new InvalidUuidError();
    }
    return new Uuid(value);
  }

  static reconstitute(value: string): Uuid {
    return new Uuid(value);
  }

  static generate(): Uuid {
    return new Uuid(uuidv7());
  }

  public toString(): string {
    return this.value;
  }
}
