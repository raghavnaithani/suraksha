// Consolidated API hooks placed in root /lib for shared access
import useSWR from "swr"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  const data = await res.json()
  if (!data.success) throw new Error(data.error || "API error")
  return data.data
}

export function useDashboardStats() {
  return useSWR("/api/dashboard/stats", fetcher, { refreshInterval: 30000 })
}

export function useWorkers(params?: { status?: string; search?: string; employerId?: string }) {
  const searchParams = new URLSearchParams()
  if (params?.status) searchParams.set("status", params.status)
  if (params?.search) searchParams.set("search", params.search)
  if (params?.employerId) searchParams.set("employerId", params.employerId)
  const url = `/api/workers${searchParams.toString() ? `?${searchParams}` : ""}`
  return useSWR(url, fetcher)
}

export function useVerifications(params?: { workerId?: string; result?: string; limit?: number }) {
  const searchParams = new URLSearchParams()
  if (params?.workerId) searchParams.set("workerId", params.workerId)
  if (params?.result) searchParams.set("result", params.result)
  if (params?.limit) searchParams.set("limit", params.limit.toString())
  const url = `/api/verifications${searchParams.toString() ? `?${searchParams}` : ""}`
  return useSWR(url, fetcher)
}

export async function apiPost(url: string, data: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const result = await res.json()
  if (!result.success) throw new Error(result.error || "API error")
  return result.data
}

export async function apiExport(payload: { type: string; id?: string; filters?: any; format?: "json" | "csv" }) {
  const res = await fetch(`/api/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const result = await res.json()
  if (!result.success) throw new Error(result.error || "Export error")
  return result.data
}
