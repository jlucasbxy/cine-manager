import { AuthServiceImpl } from "@/infra/services";
import {
  makeLogin,
  makeLogout,
  makeRefreshTokens,
  makeRequestPasswordReset,
  makeResetPassword,
  makeValidateToken
} from "@/main/factories/use-cases/auth";

export function makeAuthService(): AuthServiceImpl {
  return new AuthServiceImpl(
    makeLogin(),
    makeLogout(),
    makeRefreshTokens(),
    makeRequestPasswordReset(),
    makeResetPassword(),
    makeValidateToken()
  );
}
