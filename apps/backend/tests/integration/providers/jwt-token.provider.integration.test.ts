import { JwtTokenProvider } from "@/infrastructure/providers";

describe("JwtTokenProvider integration", () => {
  it("generates and verifies a token payload", async () => {
    const provider = new JwtTokenProvider("a".repeat(32));

    const token = await provider.generate({ userId: "user-1" }, "15m");
    const payload = await provider.verify(token);

    expect(payload).toEqual({ userId: "user-1" });
  });

  it("rejects verification when using another secret", async () => {
    const signer = new JwtTokenProvider("a".repeat(32));
    const verifier = new JwtTokenProvider("b".repeat(32));

    const token = await signer.generate({ userId: "user-1" }, "15m");

    await expect(verifier.verify(token)).rejects.toBeInstanceOf(Error);
  });

  it("rejects malformed tokens", async () => {
    const provider = new JwtTokenProvider("a".repeat(32));

    await expect(provider.verify("not-a-jwt")).rejects.toBeInstanceOf(Error);
  });
});
