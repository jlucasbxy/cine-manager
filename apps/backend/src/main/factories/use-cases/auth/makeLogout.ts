import { Logout } from "@/application/use-cases/auth";
import { PrismaRefreshTokenRepository } from "@/infra/database/repositories";

export function makeLogout(): Logout {
  return new Logout(
    new PrismaRefreshTokenRepository()
  );
}
