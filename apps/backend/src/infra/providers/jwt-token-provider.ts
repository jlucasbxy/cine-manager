import jwt from "jsonwebtoken";
import type { TokenProvider } from "@/application/interfaces/providers/token-provider";

export class JwtTokenProvider implements TokenProvider {
  constructor(private readonly secret: string) {}

  async generate(payload: { userId: string }): Promise<string> {
    return jwt.sign(payload, this.secret, { expiresIn: "1d" });
  }

  async verify(token: string): Promise<{ userId: string }> {
    const decoded = jwt.verify(token, this.secret) as { userId: string };
    return { userId: decoded.userId };
  }
}
