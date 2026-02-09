import bcrypt from "bcrypt";
import type { HashProvider } from "@/application/interfaces/providers";

export class BcryptHashProvider implements HashProvider {
  private readonly saltRounds = 10;

  async hash(plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, this.saltRounds);
  }

  async compare({
    plaintext,
    hash
  }: {
    plaintext: string;
    hash: string;
  }): Promise<boolean> {
    return bcrypt.compare(plaintext, hash);
  }
}
