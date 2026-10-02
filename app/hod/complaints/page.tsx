"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import {
  FileCheck2,
  Filter,
  Loader2,
  Lock,
  MapPin,
  Search,
  Shield,
  ShieldAlert,
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
import { fetcher, AR_CATEGORY_LABELS, AR_STATUS_LABELS } from "@/lib/client"
import type { AntiRaggingComplaint } from "@/lib/types"
import { AntiRaggingStatusBadge } from "@/components/app/anti-ragging/anti-ragging-dialogs"
import { HodInvestigationModal } from "@/components/app/anti-ragging/anti-ragging-action-dialogs"

export default function HodComplaintsPage() {
  const { data, isLoading, mutate } = useSWR<{ complaints: AntiRaggingComplaint[] }>(
    "/api/anti-ragging/complaints",
    fetcher,
    { refreshInterval: 10000 }
  )

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedComplaint, setSelectedComplaint] = useState<AntiRaggingComplaint | null>(null)
  const [openModal, setOpenModal] = useState(false)

  const complaints = data?.complaints ?? []

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      if (statusFilter !== "all" && c.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false
      }
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          c.complaintId.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          (!c.anonymous && c.studentName.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [complaints, statusFilter, search])

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          <Shield className="size-3" /> Anti-Ragging Investigation
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Assigned Department Complaints
        </h1>
        <p className="text-sm text-muted-foreground">
          Review complaints assigned to your department, conduct inquiries, record disciplinary/corrective actions, and resolve cases.
        </p>
      </div>

      {/* Filter bar */}
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="relative sm:col-span-2">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Search complaint ID, location, student name, description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Assigned to HOD">Assigned to HOD</SelectItem>
                <SelectItem value="Investigation in Progress">Investigation in Progress</SelectItem>
                <SelectItem value="Action Taken">Action Taken</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-base">Complaints Inquiries ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No assigned complaints found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Complaint ID</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Complainant</th>
                    <th className="px-4 py-3">Incident Details</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Investigation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((c) => (
                    <tr
                      key={c.id}
                      className="transition-colors hover:bg-muted/20 cursor-pointer"
                      onClick={() => {
                        setSelectedComplaint(c)
                        setOpenModal(true)
                      }}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-bold whitespace-nowrap">
                        {c.complaintId}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium">
                        {AR_CATEGORY_LABELS[c.category] || c.category}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {c.anonymous ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                            <Lock className="size-3" /> Anonymous
                          </span>
                        ) : (
                          c.studentName
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <p className="line-clamp-1">{c.location}</p>
                        <p className="text-[11px] text-muted-foreground">{c.incidentDate}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <AntiRaggingStatusBadge status={c.status} />
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedComplaint(c)
                            setOpenModal(true)
                          }}
                        >
                          Investigate →
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

      <HodInvestigationModal
        complaint={selectedComplaint}
        open={openModal}
        onOpenChange={setOpenModal}
        onUpdated={mutate}
      />
    </div>
  )
}
