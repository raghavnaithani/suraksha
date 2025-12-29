import React from "react"
import { cn } from "@lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  subtitle?: string
}

export function StatsCard({ title, value, change, changeType = "neutral", icon: Icon, subtitle }: StatsCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 glow-border">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          {change && (
            <p
              className={cn(
                "mt-2 text-xs font-medium",
                changeType === "positive" && "text-success",
                changeType === "negative" && "text-destructive",
                changeType === "neutral" && "text-muted-foreground",
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 to-transparent" />
    </div>
  )
}
