import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import type { TokenProvider } from "@/application/interfaces/providers";

export class JwtTokenProvider implements TokenProvider {
  constructor(private readonly secret: string) {}

  async generate(
    payload: { userId: string },
    expiresIn: StringValue
  ): Promise<string> {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  async verify(token: string): Promise<{ userId: string }> {
    const decoded = jwt.verify(token, this.secret) as { userId: string };
    return { userId: decoded.userId };
  }
}
