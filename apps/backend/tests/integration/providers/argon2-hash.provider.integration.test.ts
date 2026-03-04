import { Argon2HashProvider } from "@/infrastructure/providers";

describe("Argon2HashProvider integration", () => {
  it("hashes and validates plaintext", async () => {
    const provider = new Argon2HashProvider();

    const hash = await provider.hash("password123");
    const ok = await provider.compare({
      plaintext: "password123",
      hash
    });

    expect(hash).not.toBe("password123");
    expect(ok).toBe(true);
  });

  it("returns false for non-matching plaintext", async () => {
    const provider = new Argon2HashProvider();
    const hash = await provider.hash("password123");

    const ok = await provider.compare({
      plaintext: "different-password",
      hash
    });

    expect(ok).toBe(false);
  });
});
