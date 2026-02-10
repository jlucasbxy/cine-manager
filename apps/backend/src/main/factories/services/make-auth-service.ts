import { AuthServiceImpl } from "@/infrastructure/services";
import {
  makeLogin,
  makeLogout,
  makeRefreshTokens,
  makeRequestPasswordReset,
  makeResetPassword,
  makeValidateToken
} from "@/main/factories/use-cases/auth";
import { singleton } from "@/main/factories/singleton";

export const makeAuthService = singleton(
  () =>
    new AuthServiceImpl(
      makeLogin(),
      makeLogout(),
      makeRefreshTokens(),
      makeRequestPasswordReset(),
      makeResetPassword(),
      makeValidateToken()
    )
);
