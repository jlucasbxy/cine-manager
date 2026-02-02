export interface HashProvider {
  hash(plaintext: string): Promise<string>;
  compare(params: { plaintext: string; hash: string }): Promise<boolean>;
}
