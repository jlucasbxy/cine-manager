import argon2 from "argon2";
import type { HashProvider } from "@/application/interfaces/providers";

export class Argon2HashProvider implements HashProvider {
  async hash(plaintext: string): Promise<string> {
    return argon2.hash(plaintext, {
      type: argon2.argon2id
    });
  }

  async compare({
    plaintext,
    hash
  }: {
    plaintext: string;
    hash: string;
  }): Promise<boolean> {
    return argon2.verify(plaintext, hash);
  }
}
