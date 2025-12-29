"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "../../src/lib/lucide-stub.jsx"
import { Switch } from "./switch"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const isDark = resolvedTheme === "dark"

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch
        aria-label="Toggle color scheme"
        checked={isDark}
        onCheckedChange={(val) => setTheme(val ? "dark" : "light")}
      />
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  )
}

export default ThemeToggle
