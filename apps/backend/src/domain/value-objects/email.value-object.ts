import z from "zod";
import { InvalidEmailError } from "@/domain/errors/invalid-email.error";

export class Email {

  private readonly value: string;
  constructor(value: string) {
    const r = z.email().safeParse(value);
    if (r.success) {
      throw new InvalidEmailError();
    }
    this.value = value;
  }


  public toString(): string {
    return this.value;
  }
}
