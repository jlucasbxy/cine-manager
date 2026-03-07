import { PasswordStrengthValidator } from "@repo/validators";
import { useEffect, useState } from "react";
import { useDebounce } from "./use-debounce";

interface PasswordStrengthResult {
  score: number;
  feedback: { warning: string; suggestions: string[] };
  isLoading: boolean;
}

const emptyResult: PasswordStrengthResult = {
  score: 0,
  feedback: { warning: "", suggestions: [] },
  isLoading: false
};

const strengthValidator = new PasswordStrengthValidator();

export function usePasswordStrength(password: string): PasswordStrengthResult {
  const [result, setResult] = useState<PasswordStrengthResult>(emptyResult);
  const debouncedPassword = useDebounce(password, 300);

  useEffect(() => {
    if (!debouncedPassword) {
      setResult(emptyResult);
      return;
    }

    const evaluation = strengthValidator.check(debouncedPassword);

    setResult({
      score: evaluation.score,
      feedback: {
        warning: evaluation.feedback.warning?.toString() ?? "",
        suggestions: evaluation.feedback.suggestions?.map(String) ?? []
      },
      isLoading: false
    });
  }, [debouncedPassword]);

  return result;
}
