import {
  EmailValidator,
  LoginValidator,
  ResetPasswordValidator
} from "@repo/validators";
import { AuthController } from "@/infrastructure/http/controllers";
import { makeAuthService } from "@/main/factories/services";

export function makeAuthController(): AuthController {
  return new AuthController(
    makeAuthService(),
    new LoginValidator(),
    new EmailValidator(),
    new ResetPasswordValidator()
  );
}
