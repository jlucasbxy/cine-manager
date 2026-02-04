import type { StringValue } from "ms";

export interface TokenProvider {
  generate(payload: { userId: string }, expiresIn: StringValue): Promise<string>;
  verify(token: string): Promise<{ userId: string }>;
}
