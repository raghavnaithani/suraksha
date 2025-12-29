"use client"

import React, { useState } from "react"
import { Download, FileText } from "@lib/lucide-stub"
import { Button } from "./button"
import { apiExport } from "@lib/use-api"
import { downloadCsv, downloadJson } from "@lib/utils"

export default function ExportButton({
  type,
  id,
  children,
  variant = "outline",
  label = "Export",
  format = "json",
}: {
  type: string
  id?: string
  format?: "json" | "csv"
  filters?: any
  label?: string
  variant?: "outline" | "ghost" | "default"
  children?: React.ReactNode
}) {
  const [loading, setLoading] = useState(false)

  return (
    <Button
      size="sm"
      variant={variant as any}
      className="border-zinc-700 bg-transparent"
      onClick={async () => {
        setLoading(true)
        try {
          const result = await apiExport({ type, id, format })
          if (format === "csv" && Array.isArray(result)) {
            downloadCsv(result, `${id || type}-export.csv`)
          } else if (format === "csv" && result && result.verifications) {
            downloadCsv(result.verifications, `${id}-verifications.csv`)
          } else {
            downloadJson(result, `${id || type}-export.json`)
          }
        } catch (err) {
          console.error("Export failed", err)
        } finally {
          setLoading(false)
        }
      }}
      disabled={loading}
    >
      {loading ? (
        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      {children ?? label}
    </Button>
  )
}
