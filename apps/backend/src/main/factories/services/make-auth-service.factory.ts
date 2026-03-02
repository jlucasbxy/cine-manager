import { AuthServiceImpl } from "@/infrastructure/services";
import { singleton } from "@/main/factories/singleton.util";
import {
  makeLogin,
  makeLogout,
  makeRefreshTokens,
  makeRequestPasswordReset,
  makeResetPassword
} from "@/main/factories/use-cases/auth";

export const makeAuthService = singleton(
  () =>
    new AuthServiceImpl(
      makeLogin(),
      makeLogout(),
      makeRefreshTokens(),
      makeRequestPasswordReset(),
      makeResetPassword()
    )
);
