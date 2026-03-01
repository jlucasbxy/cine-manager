import { useEffect, useState } from "react";
import type { ZxcvbnResult } from "@zxcvbn-ts/core";
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

export function usePasswordStrength(password: string): PasswordStrengthResult {
  const [result, setResult] = useState<PasswordStrengthResult>(emptyResult);
  const debouncedPassword = useDebounce(password, 300);

  useEffect(() => {
    if (!debouncedPassword) {
      setResult(emptyResult);
      return;
    }

    let cancelled = false;
    setResult((prev) => ({ ...prev, isLoading: true }));

    (async () => {
      const [{ zxcvbn, zxcvbnOptions }, common, en] = await Promise.all([
        import("@zxcvbn-ts/core"),
        import("@zxcvbn-ts/language-common"),
        import("@zxcvbn-ts/language-en")
      ]);

      zxcvbnOptions.setOptions({
        translations: en.translations,
        graphs: common.adjacencyGraphs,
        dictionary: {
          ...common.dictionary,
          ...en.dictionary
        }
      });

      const evaluation: ZxcvbnResult = zxcvbn(debouncedPassword);

      if (!cancelled) {
        setResult({
          score: evaluation.score,
          feedback: {
            warning: evaluation.feedback.warning?.toString() ?? "",
            suggestions: evaluation.feedback.suggestions?.map(String) ?? []
          },
          isLoading: false
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedPassword]);

  return result;
}
