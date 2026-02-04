export interface TokenProvider {
  generate(payload: { userId: string }): Promise<string>;
  verify(token: string): Promise<{ userId: string }>;
}
