import { Logout } from "@/application/use-cases/auth";
import { makeRefreshTokenRepository } from "@/main/factories/repositories";

export function makeLogout(): Logout {
  return new Logout(makeRefreshTokenRepository());
}
