"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import {
  CheckCircle2,
  Clock,
  FileCheck2,
  FileText,
  Loader2,
  Lock,
  MapPin,
  Shield,
  ShieldAlert,
  UserCheck,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetcher, AR_CATEGORY_LABELS } from "@/lib/client"
import type { AntiRaggingComplaint, PublicUser } from "@/lib/types"
import { AntiRaggingStatusBadge } from "@/components/app/anti-ragging/anti-ragging-dialogs"
import { HodInvestigationModal } from "@/components/app/anti-ragging/anti-ragging-action-dialogs"

export default function HodDashboardPage() {
  const { data: me } = useSWR<{ user: PublicUser }>("/api/auth/me", fetcher)
  const { data, isLoading, mutate } = useSWR<{ complaints: AntiRaggingComplaint[] }>(
    "/api/anti-ragging/complaints",
    fetcher,
    { refreshInterval: 10000 }
  )

  const [selectedComplaint, setSelectedComplaint] = useState<AntiRaggingComplaint | null>(null)
  const [openModal, setOpenModal] = useState(false)

  const complaints = data?.complaints ?? []

  const stats = useMemo(() => {
    return {
      total: complaints.length,
      assigned: complaints.filter((c) => c.status === "Assigned to HOD").length,
      inProgress: complaints.filter((c) => c.status === "Investigation in Progress").length,
      actionTaken: complaints.filter((c) => c.status === "Action Taken").length,
      resolved: complaints.filter((c) => c.status === "Resolved").length,
    }
  }, [complaints])

  const pendingComplaints = complaints.filter(
    (c) => c.status === "Assigned to HOD" || c.status === "Investigation in Progress"
  )

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <Shield className="size-3.5" /> Department Head Portal
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Welcome, {me?.user.name ?? "HOD"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {me?.user.department ? `${me.user.department} Department` : "Department"} Anti-Ragging Investigation & Grievance Cell
          </p>
        </div>

        <Button nativeButton={false} render={<Link href="/hod/complaints" />}>
          View All Assigned Complaints ({complaints.length})
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="p-4 pb-1">
            <p className="text-xs font-medium text-muted-foreground">Total Assigned</p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="p-4 pb-1">
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Needs Investigation</p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.assigned}</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader className="p-4 pb-1">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">In Progress</p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader className="p-4 pb-1">
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Resolved</p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.resolved}</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Action Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldAlert className="size-4 text-primary" /> Active Inquiries Pending Action ({pendingComplaints.length})
          </CardTitle>
          <CardDescription>
            These complaints require immediate investigation, inquiry notes, or disciplinary enforcement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : pendingComplaints.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No pending complaints requiring inquiry. All assigned cases are resolved.
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {pendingComplaints.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col justify-between gap-3 py-3 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center px-2 rounded-lg cursor-pointer"
                  onClick={() => {
                    setSelectedComplaint(c)
                    setOpenModal(true)
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold">{c.complaintId}</span>
                      <AntiRaggingStatusBadge status={c.status} />
                      {c.anonymous && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                          <Lock className="size-3" /> Anonymous Complainant
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold">{AR_CATEGORY_LABELS[c.category] || c.category}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      Location: {c.location} · People: {c.peopleInvolved}
                    </p>
                  </div>

                  <Button size="sm" variant="default" className="text-xs shrink-0">
                    Investigate & Record Action →
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <HodInvestigationModal
        complaint={selectedComplaint}
        open={openModal}
        onOpenChange={setOpenModal}
        onUpdated={mutate}
      />
    </div>
  )
}
