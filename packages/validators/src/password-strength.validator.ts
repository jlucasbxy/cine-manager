import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";

zxcvbnOptions.setOptions({
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary
  }
});

export const MIN_PASSWORD_SCORE = 3;

export class PasswordStrengthValidator {
  check(password: string) {
    return zxcvbn(password);
  }

  isStrong(password: string): boolean {
    return this.check(password).score >= MIN_PASSWORD_SCORE;
  }
}
