"use client"

import { useState } from "react"
import useSWR from "swr"
import {
  AlertTriangle,
  Clock,
  ExternalLink,
  HelpCircle,
  LifeBuoy,
  Loader2,
  Phone,
  PhoneCall,
  PlusCircle,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { fetcher, AR_CATEGORY_LABELS } from "@/lib/client"
import type { AntiRaggingComplaint, PublicUser } from "@/lib/types"
import {
  AntiRaggingStatusBadge,
  ReportRaggingDialog,
} from "@/components/app/anti-ragging/anti-ragging-dialogs"
import { StudentComplaintDetailsModal } from "@/components/app/anti-ragging/anti-ragging-action-dialogs"

export default function StudentAntiRaggingPage() {
  const { data: me } = useSWR<{ user: PublicUser }>("/api/auth/me", fetcher)
  const { data, mutate, isLoading } = useSWR<{ complaints: AntiRaggingComplaint[] }>(
    "/api/anti-ragging/my-complaints",
    fetcher,
    { refreshInterval: 10000 }
  )

  const [openNew, setOpenNew] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState<AntiRaggingComplaint | null>(null)
  const [openDetails, setOpenDetails] = useState(false)
  const [search, setSearch] = useState("")

  const complaints = data?.complaints ?? []
  const filtered = complaints.filter((c) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      c.complaintId.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q)
    )
  })

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-destructive/20 bg-gradient-to-r from-destructive/10 via-background to-background p-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
            <ShieldAlert className="size-3.5" /> Zero Tolerance Campus Policy
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Anti-Ragging Support & Reporting Portal
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Any act of harassment, intimidation, or ragging is strictly prohibited by law. Your report is confidential and protected.
          </p>
        </div>

        <Button
          size="lg"
          variant="destructive"
          className="shrink-0 gap-2 font-semibold shadow-sm"
          onClick={() => setOpenNew(true)}
        >
          <PlusCircle className="size-5" /> Report Ragging
        </Button>
      </div>

      {/* Awareness & Emergency Help Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Card 1: Emergency Helplines */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-destructive">
              <PhoneCall className="size-4" />
              <CardTitle className="text-base">Emergency Contacts</CardTitle>
            </div>
            <CardDescription className="text-xs">Immediate 24/7 assistance</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5 text-xs">
            <div className="flex items-center justify-between rounded-lg border border-border p-2.5">
              <div>
                <p className="font-semibold text-foreground">National Toll-Free</p>
                <p className="text-muted-foreground">24x7 UGC Helpline</p>
              </div>
              <span className="font-mono font-bold text-destructive">1800-180-5522</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-2.5">
              <div>
                <p className="font-semibold text-foreground">Campus Security</p>
                <p className="text-muted-foreground">Control Room</p>
              </div>
              <span className="font-mono font-bold text-foreground">011-2345-6789</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-2.5">
              <div>
                <p className="font-semibold text-foreground">Chief Proctor Cell</p>
                <p className="text-muted-foreground">Internal Committee</p>
              </div>
              <span className="font-mono font-bold text-foreground">proctor@campus.edu</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Awareness & Rights */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="size-4" />
              <CardTitle className="text-base">Know What Constitutes Ragging</CardTitle>
            </div>
            <CardDescription className="text-xs">Regulations & Legal Rights</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-xs text-muted-foreground">
            <p>
              • <strong>Verbal abuse:</strong> derogatory insults, teasing, embarrassment.
            </p>
            <p>
              • <strong>Physical coercion:</strong> forcing any physical act, tasks, or confinement.
            </p>
            <p>
              • <strong>Cyber bullying:</strong> threatening messages, memes, or WhatsApp harassment.
            </p>
            <p>
              • <strong>Financial extortion:</strong> forced collection of money or personal items.
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Fair & Transparent Process */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Shield className="size-4" />
              <CardTitle className="text-base">Confidentiality & Process</CardTitle>
            </div>
            <CardDescription className="text-xs">How complaints are handled</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-xs text-muted-foreground">
            <p>
              1. <strong>Submitted:</strong> Main Admin verifies basic details within 12 hours.
            </p>
            <p>
              2. <strong>Assigned to HOD:</strong> Designated department head conducts inquiry.
            </p>
            <p>
              3. <strong>Action Taken:</strong> Disciplinary action is recorded and enforced.
            </p>
            <p>
              4. <strong>Anonymity:</strong> You can submit anonymously without fear of retaliation.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* My Complaints Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-lg">My Submitted Complaints</CardTitle>
              <CardDescription>
                Track the live investigation status and recorded actions for your complaints.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search complaints..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 text-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-36 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShieldCheck className="size-12 text-muted-foreground/50" />
              <p className="mt-3 font-semibold text-foreground">No complaints filed</p>
              <p className="text-xs text-muted-foreground">
                You have not submitted any anti-ragging complaints. If you experience or witness ragging, report it immediately.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 gap-1.5"
                onClick={() => setOpenNew(true)}
              >
                <PlusCircle className="size-4" /> File a Complaint
              </Button>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {filtered.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedComplaint(c)
                    setOpenDetails(true)
                  }}
                  className="flex flex-col justify-between gap-3 py-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center cursor-pointer px-2 rounded-lg"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-foreground">
                        {c.complaintId}
                      </span>
                      <AntiRaggingStatusBadge status={c.status} />
                      {c.anonymous && (
                        <Badge variant="secondary" className="text-[10px]">
                          Anonymous
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {AR_CATEGORY_LABELS[c.category] || c.category}
                    </p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      Location: {c.location} · Incident Date: {c.incidentDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs text-muted-foreground">
                      <span>Submitted {new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">
                      View Status & Timeline →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {me?.user && (
        <ReportRaggingDialog
          open={openNew}
          onOpenChange={setOpenNew}
          onCreated={mutate}
          user={me.user}
        />
      )}

      <StudentComplaintDetailsModal
        complaint={selectedComplaint}
        open={openDetails}
        onOpenChange={setOpenDetails}
      />
    </div>
  )
}
