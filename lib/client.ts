import type { ComplaintCategory, ComplaintStatus, Priority, Role } from "./types"

export async function fetcher<T = any>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || "Request failed")
  }
  return res.json()
}

export async function apiSend<T = any>(
  url: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT" = "GET",
  body?: unknown,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || "Request failed")
  return data
}

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  pending: "Pending",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
}

export const CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  electrical: "Electrical",
  plumbing: "Plumbing",
  furniture: "Furniture",
  cleaning: "Cleaning",
  network: "Network",
  civil: "Civil",
  other: "Other",
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
}

export const ROLE_LABELS: Record<Role, string> = {
  student: "Student",
  faculty: "Faculty",
  maintenance: "Maintenance",
  admin: "Administrator",
  hod: "HOD / Sub-Admin",
}

export function roleHome(role: Role): string {
  if (role === "admin") return "/admin"
  if (role === "hod") return "/hod"
  if (role === "maintenance") return "/maintenance"
  return "/portal"
}

export const AR_CATEGORY_LABELS: Record<string, string> = {
  verbal_abuse: "Verbal Abuse & Insults",
  physical: "Physical Assault / Threat",
  hostile_behavior: "Hostile Behavior & Bullying",
  cyber_ragging: "Cyber Ragging & Online Abuse",
  extortion: "Extortion / Financial Coercion",
  sexual_harassment: "Sexual Harassment",
  discrimination: "Discrimination / Target Harassment",
  other: "Other Form of Ragging",
}

export const AR_STATUS_LABELS: Record<string, string> = {
  "Submitted": "Submitted",
  "Under Review": "Under Review",
  "Assigned to HOD": "Assigned to HOD",
  "Investigation in Progress": "Investigation in Progress",
  "Action Taken": "Action Taken",
  "Resolved": "Resolved",
  "Rejected": "Rejected",
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}
