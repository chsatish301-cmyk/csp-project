"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  HelpCircle,
  Loader2,
  Lock,
  MapPin,
  Search,
  Shield,
  ShieldAlert,
  UserCheck,
  Users,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { fetcher, AR_CATEGORY_LABELS, AR_STATUS_LABELS } from "@/lib/client"
import type { AntiRaggingComplaint, AntiRaggingStatus, PublicUser } from "@/lib/types"
import { AntiRaggingStatusBadge } from "@/components/app/anti-ragging/anti-ragging-dialogs"
import { AdminManageComplaintModal } from "@/components/app/anti-ragging/anti-ragging-action-dialogs"

export default function AdminAntiRaggingPage() {
  const { data: complaintsData, isLoading, mutate } = useSWR<{ complaints: AntiRaggingComplaint[] }>(
    "/api/anti-ragging/complaints",
    fetcher,
    { refreshInterval: 10000 }
  )
  const { data: hodsData } = useSWR<{ users: PublicUser[] }>(
    "/api/users?role=hod",
    fetcher
  )

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("")

  const [selectedComplaint, setSelectedComplaint] = useState<AntiRaggingComplaint | null>(null)
  const [openModal, setOpenModal] = useState(false)

  const complaints = complaintsData?.complaints ?? []
  const hods = hodsData?.users ?? []

  // Statistics calculation
  const stats = useMemo(() => {
    return {
      total: complaints.length,
      newComplaints: complaints.filter((c) => c.status === "Submitted").length,
      underReview: complaints.filter((c) => c.status === "Under Review").length,
      assigned: complaints.filter((c) => c.status === "Assigned to HOD").length,
      inProgress: complaints.filter((c) => c.status === "Investigation in Progress").length,
      resolved: complaints.filter((c) => c.status === "Resolved").length,
    }
  }, [complaints])

  // Unique departments for filter
  const departments = useMemo(() => {
    const set = new Set<string>()
    complaints.forEach((c) => {
      if (c.department) set.add(c.department)
    })
    return Array.from(set)
  }, [complaints])

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      if (statusFilter !== "all" && c.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false
      }
      if (departmentFilter !== "all" && c.department?.toLowerCase() !== departmentFilter.toLowerCase()) {
        return false
      }
      if (dateFilter && c.incidentDate !== dateFilter) {
        return false
      }
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          c.complaintId.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          (!c.anonymous && c.studentName.toLowerCase().includes(q)) ||
          (c.assignedHodName && c.assignedHodName.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [complaints, statusFilter, departmentFilter, dateFilter, search])

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
            <ShieldAlert className="size-3" /> Anti-Ragging Cell Oversight
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Anti-Ragging Complaints Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Verify complaints, assign inquiries to department HODs, monitor investigations, and audit actions.
          </p>
        </div>
      </div>

      {/* Admin Statistics Cards */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        <Card className="border-border">
          <CardHeader className="p-4 pb-1">
            <p className="text-xs font-medium text-muted-foreground">Total Complaints</p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="p-4 pb-1">
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">New Complaints</p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.newComplaints}</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardHeader className="p-4 pb-1">
            <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Under Review</p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.underReview}</p>
          </CardContent>
        </Card>

        <Card className="border-indigo-500/30 bg-indigo-500/5">
          <CardHeader className="p-4 pb-1">
            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Assigned</p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.assigned}</p>
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

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="relative sm:col-span-1">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Search ID, student, keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.keys(AR_STATUS_LABELS).map((st) => (
                  <SelectItem key={st} value={st}>
                    {st}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Filter by date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs"
            />
          </div>

          {(statusFilter !== "all" || departmentFilter !== "all" || dateFilter || search) && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Filtering active.</span>
              <button
                onClick={() => {
                  setStatusFilter("all")
                  setDepartmentFilter("all")
                  setDateFilter("")
                  setSearch("")
                }}
                className="font-medium text-primary hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Complaints Table */}
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-base">Complaints Registry ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No anti-ragging complaints match your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Complaint ID</th>
                    <th className="px-4 py-3">Complainant</th>
                    <th className="px-4 py-3">Category & Location</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Assigned HOD</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((c) => (
                    <tr
                      key={c.id}
                      className="transition-colors hover:bg-muted/30 cursor-pointer"
                      onClick={() => {
                        setSelectedComplaint(c)
                        setOpenModal(true)
                      }}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-bold text-foreground whitespace-nowrap">
                        {c.complaintId}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {c.anonymous ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                            <Lock className="size-3" /> Anonymous
                          </span>
                        ) : (
                          <div>
                            <p className="font-semibold text-foreground">{c.studentName}</p>
                            <p className="text-[11px] text-muted-foreground">{c.studentId}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <p className="font-semibold text-foreground">{AR_CATEGORY_LABELS[c.category] || c.category}</p>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">{c.location}</p>
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-foreground whitespace-nowrap">
                        {c.department}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {c.assignedHodName ? (
                          <span className="font-medium text-foreground">{c.assignedHodName}</span>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground border-dashed">
                            Unassigned
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <AntiRaggingStatusBadge status={c.status} />
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedComplaint(c)
                            setOpenModal(true)
                          }}
                        >
                          Manage →
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal for Admin Verification & Assignment */}
      <AdminManageComplaintModal
        complaint={selectedComplaint}
        open={openModal}
        onOpenChange={setOpenModal}
        onUpdated={mutate}
        hodList={hods}
      />
    </div>
  )
}
