"use client"

import useSWR from "swr"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch")
  }
  const data = await res.json()
  if (!data.success) {
    throw new Error(data.error || "API error")
  }
  return data.data
}

// Dashboard stats
export function useDashboardStats() {
  return useSWR("/api/dashboard/stats", fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  })
}

// Workers
export function useWorkers(params?: { status?: string; search?: string; employerId?: string }) {
  const searchParams = new URLSearchParams()
  if (params?.status) searchParams.set("status", params.status)
  if (params?.search) searchParams.set("search", params.search)
  if (params?.employerId) searchParams.set("employerId", params.employerId)

  const url = `/api/workers${searchParams.toString() ? `?${searchParams}` : ""}`
  return useSWR(url, fetcher)
}

export function useWorker(workerId: string | null) {
  return useSWR(workerId ? `/api/workers/${workerId}` : null, fetcher)
}

// Employers
export function useEmployers() {
  return useSWR("/api/employers", fetcher)
}

// Contracts
export function useContracts(params?: { workerId?: string; employerId?: string; status?: string }) {
  const searchParams = new URLSearchParams()
  if (params?.workerId) searchParams.set("workerId", params.workerId)
  if (params?.employerId) searchParams.set("employerId", params.employerId)
  if (params?.status) searchParams.set("status", params.status)

  const url = `/api/contracts${searchParams.toString() ? `?${searchParams}` : ""}`
  return useSWR(url, fetcher)
}

// Verifications
export function useVerifications(params?: { workerId?: string; result?: string; limit?: number }) {
  const searchParams = new URLSearchParams()
  if (params?.workerId) searchParams.set("workerId", params.workerId)
  if (params?.result) searchParams.set("result", params.result)
  if (params?.limit) searchParams.set("limit", params.limit.toString())

  const url = `/api/verifications${searchParams.toString() ? `?${searchParams}` : ""}`
  return useSWR(url, fetcher)
}

// Incidents
export function useIncidents(params?: { workerId?: string; status?: string; severity?: string }) {
  const searchParams = new URLSearchParams()
  if (params?.workerId) searchParams.set("workerId", params.workerId)
  if (params?.status) searchParams.set("status", params.status)
  if (params?.severity) searchParams.set("severity", params.severity)

  const url = `/api/incidents${searchParams.toString() ? `?${searchParams}` : ""}`
  return useSWR(url, fetcher)
}

// Tasks
export function useTasks(params?: { workerId?: string; employerId?: string; status?: string }) {
  const searchParams = new URLSearchParams()
  if (params?.workerId) searchParams.set("workerId", params.workerId)
  if (params?.employerId) searchParams.set("employerId", params.employerId)
  if (params?.status) searchParams.set("status", params.status)

  const url = `/api/tasks${searchParams.toString() ? `?${searchParams}` : ""}`
  return useSWR(url, fetcher)
}

// Audit Logs
export function useAuditLogs(params?: { actorId?: string; action?: string; resource?: string; limit?: number }) {
  const searchParams = new URLSearchParams()
  if (params?.actorId) searchParams.set("actorId", params.actorId)
  if (params?.action) searchParams.set("action", params.action)
  if (params?.resource) searchParams.set("resource", params.resource)
  if (params?.limit) searchParams.set("limit", params.limit.toString())

  const url = `/api/audit-logs${searchParams.toString() ? `?${searchParams}` : ""}`
  return useSWR(url, fetcher)
}

// API mutation helpers
export async function apiPost(url: string, data: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const result = await res.json()
  if (!result.success) {
    throw new Error(result.error || "API error")
  }
  return result.data
}

export async function apiGet(url: string) {
  const res = await fetch(url)
  const result = await res.json()
  if (!result.success) {
    throw new Error(result.error || "API error")
  }
  return result.data
}

export async function apiPatch(url: string, data: unknown) {
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const result = await res.json()
  if (!result.success) {
    throw new Error(result.error || "API error")
  }
  return result.data
}

export async function apiDelete(url: string) {
  const res = await fetch(url, { method: "DELETE" })
  const result = await res.json()
  if (!result.success) {
    throw new Error(result.error || "API error")
  }
  return result.data
}

export async function apiExport(payload: { type: string; id?: string; filters?: any; format?: "json" | "csv" }) {
  const res = await fetch(`/api/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const result = await res.json()
  if (!result.success) {
    throw new Error(result.error || "Export error")
  }
  return result.data
}
