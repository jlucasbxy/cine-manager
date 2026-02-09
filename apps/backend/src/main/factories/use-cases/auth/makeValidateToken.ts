import { ValidateToken } from "@/application/use-cases/auth";
import { makeTokenProvider } from "@/main/factories/providers";

export function makeValidateToken(): ValidateToken {
  return new ValidateToken(makeTokenProvider());
}
