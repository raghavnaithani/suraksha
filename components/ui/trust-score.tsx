import { cn } from '@lib/utils'

interface TrustScoreProps {
  score: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function TrustScore({ score, size = "md", showLabel = true }: TrustScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-success"
    if (score >= 40) return "text-warning"
    return "text-destructive"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 70) return "HIGH TRUST"
    if (score >= 40) return "MEDIUM TRUST"
    return "LOW TRUST"
  }

  const getProgressColor = (score: number) => {
    if (score >= 70) return "bg-success"
    if (score >= 40) return "bg-warning"
    return "bg-destructive"
  }

  return (
    <div
      className={cn("flex flex-col", size === "sm" && "gap-1", size === "md" && "gap-1.5", size === "lg" && "gap-2")}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "font-mono font-bold tabular-nums",
            getScoreColor(score),
            size === "sm" && "text-lg",
            size === "md" && "text-2xl",
            size === "lg" && "text-4xl",
          )}
        >
          {score}
        </span>
        {showLabel && (
          <span
            className={cn(
              "font-mono uppercase tracking-wider",
              getScoreColor(score),
              size === "sm" && "text-[10px]",
              size === "md" && "text-xs",
              size === "lg" && "text-sm",
            )}
          >
            {getScoreLabel(score)}
          </span>
        )}
      </div>
      <div
        className={cn(
          "w-full rounded-full bg-muted overflow-hidden",
          size === "sm" && "h-1",
          size === "md" && "h-1.5",
          size === "lg" && "h-2",
        )}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500", getProgressColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

// Backwards compatibility name used across the app
export const TrustScoreGauge = TrustScore
