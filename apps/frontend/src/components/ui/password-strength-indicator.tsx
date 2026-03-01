interface PasswordStrengthIndicatorProps {
  score: number;
  feedback: { warning: string; suggestions: string[] };
  show: boolean;
}

const SCORE_CONFIG = [
  { label: "Very weak", color: "bg-red-500" },
  { label: "Weak", color: "bg-orange-500" },
  { label: "Fair", color: "bg-yellow-500" },
  { label: "Strong", color: "bg-green-500" },
  { label: "Very strong", color: "bg-emerald-500" }
] as const;

export function PasswordStrengthIndicator({
  score,
  feedback,
  show
}: PasswordStrengthIndicatorProps) {
  if (!show) return null;

  const config = SCORE_CONFIG[score];
  const widthPercent = ((score + 1) / 5) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Password strength
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          {config.label}
        </span>
      </div>

      <div className="h-1.5 w-full rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-300 ${config.color}`}
          style={{ width: `${widthPercent}%` }}
        />
      </div>

      {feedback.warning && (
        <p className="text-xs text-muted-foreground">{feedback.warning}</p>
      )}
      {feedback.suggestions.length > 0 && (
        <ul className="text-xs text-muted-foreground">
          {feedback.suggestions.map((suggestion) => (
            <li key={suggestion}>{suggestion}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
