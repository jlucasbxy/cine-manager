import z from "zod";
import { InvalidUrlError } from "@/domain/errors";

export class Url {

  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Url {
    const r = z.url().safeParse(value);
    if (!r.success) {
      throw new InvalidUrlError();
    }
    return new Url(value);
  }

  static reconstitute(value: string): Url {
    return new Url(value);
  }

  public toString(): string {
    return this.value;
  }
}
