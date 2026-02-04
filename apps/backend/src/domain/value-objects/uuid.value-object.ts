import z from "zod";
import { InvalidUuidError } from "@/domain/errors/invalid-uuid.error";

export class Uuid {

  private readonly value: string;
  constructor(value: string) {
    const r = z.uuid().safeParse(value);
    if (!r.success) {
      throw new InvalidUuidError();
    }
    this.value = value;
  }

  public toString(): string {
    return this.value;
  }
}
