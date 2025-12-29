import { cn } from "@lib/utils"
import type { VerificationStatus, WorkerStatus, BackgroundCheckStatus } from "@/lib/types"

interface StatusBadgeProps {
  status: VerificationStatus | WorkerStatus | BackgroundCheckStatus
  size?: "sm" | "md" | "lg"
}

const statusConfig = {
  // Verification Status
  GREEN: { label: "VERIFIED", className: "bg-success/20 text-success border-success/30" },
  YELLOW: { label: "CAUTION", className: "bg-warning/20 text-warning border-warning/30" },
  RED: { label: "ALERT", className: "bg-destructive/20 text-destructive border-destructive/30" },
  // Worker Status
  active: { label: "ACTIVE", className: "bg-success/20 text-success border-success/30" },
  suspended: { label: "SUSPENDED", className: "bg-warning/20 text-warning border-warning/30" },
  terminated: { label: "TERMINATED", className: "bg-muted text-muted-foreground border-border" },
  investigation_pending: {
    label: "INVESTIGATION",
    className: "bg-destructive/20 text-destructive border-destructive/30",
  },
  fraud_suspected: { label: "FRAUD ALERT", className: "bg-destructive/20 text-destructive border-destructive/30" },
  // Background Check Status
  pending: { label: "PENDING", className: "bg-warning/20 text-warning border-warning/30" },
  cleared: { label: "CLEARED", className: "bg-success/20 text-success border-success/30" },
  flagged: { label: "FLAGGED", className: "bg-destructive/20 text-destructive border-destructive/30" },
  rejected: { label: "REJECTED", className: "bg-destructive/20 text-destructive border-destructive/30" },
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground border-border" }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono font-semibold uppercase tracking-wider border rounded-md",
        config.className,
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-2.5 py-1 text-xs",
        size === "lg" && "px-3 py-1.5 text-sm",
      )}
    >
      <span
        className={cn(
          "rounded-full",
          size === "sm" && "h-1.5 w-1.5",
          size === "md" && "h-2 w-2",
          size === "lg" && "h-2.5 w-2.5",
          status === "GREEN" || status === "active" || status === "cleared" ? "bg-success animate-pulse" : "",
          status === "YELLOW" || status === "suspended" || status === "pending" ? "bg-warning" : "",
          status === "RED" ||
            status === "investigation_pending" ||
            status === "fraud_suspected" ||
            status === "flagged" ||
            status === "rejected"
            ? "bg-destructive animate-pulse"
            : "",
        )}
      />
      {config.label}
    </span>
  )
}
