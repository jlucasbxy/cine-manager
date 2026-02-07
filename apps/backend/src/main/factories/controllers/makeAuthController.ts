import { AuthController } from "@/infra/http/controllers";
import {
  LoginValidator,
  EmailValidator,
  RefreshTokenValidator,
  ResetPasswordValidator
} from "@repo/validators";
import { makeAuthService } from "@/main/factories/services";

export function makeAuthController(): AuthController {
  return new AuthController(
    makeAuthService(),
    new LoginValidator(),
    new EmailValidator(),
    new RefreshTokenValidator(),
    new ResetPasswordValidator()
  );
}
