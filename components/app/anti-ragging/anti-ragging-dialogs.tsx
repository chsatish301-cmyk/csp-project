"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  Loader2,
  MapPin,
  Paperclip,
  Shield,
  ShieldAlert,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { apiSend, AR_CATEGORY_LABELS, AR_STATUS_LABELS, timeAgo } from "@/lib/client"
import type {
  AntiRaggingCategory,
  AntiRaggingComplaint,
  AntiRaggingStatus,
  ComplaintAction,
  EvidenceAttachment,
  PublicUser,
} from "@/lib/types"
import { cn } from "@/lib/utils"

export function AntiRaggingStatusBadge({ status }: { status: AntiRaggingStatus | string }) {
  const norm = status || "Submitted"
  switch (norm) {
    case "Submitted":
      return (
        <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Clock className="mr-1 size-3" /> Submitted
        </Badge>
      )
    case "Under Review":
      return (
        <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400">
          <HelpCircle className="mr-1 size-3" /> Under Review
        </Badge>
      )
    case "Assigned to HOD":
      return (
        <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <UserCheck className="mr-1 size-3" /> Assigned to HOD
        </Badge>
      )
    case "Investigation in Progress":
      return (
        <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Loader2 className="mr-1 size-3 animate-spin" /> In Progress
        </Badge>
      )
    case "Action Taken":
      return (
        <Badge variant="outline" className="border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
          <CheckCircle2 className="mr-1 size-3" /> Action Taken
        </Badge>
      )
    case "Resolved":
      return (
        <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="mr-1 size-3" /> Resolved
        </Badge>
      )
    case "Rejected":
      return (
        <Badge variant="destructive">
          <XCircle className="mr-1 size-3" /> Rejected
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const STAGES: AntiRaggingStatus[] = [
  "Submitted",
  "Under Review",
  "Assigned to HOD",
  "Investigation in Progress",
  "Action Taken",
  "Resolved",
]

export function ComplaintTimeline({
  complaint,
  history,
}: {
  complaint: AntiRaggingComplaint
  history?: ComplaintAction[]
}) {
  const currentIdx = STAGES.indexOf(complaint.status)
  const isRejected = complaint.status === "Rejected"

  return (
    <div className="flex flex-col gap-6">
      {/* Visual Pipeline */}
      {!isRejected ? (
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Resolution Pipeline
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
            {STAGES.map((st, idx) => {
              const isPast = currentIdx >= idx
              const isCurrent = currentIdx === idx
              return (
                <div
                  key={st}
                  className={cn(
                    "flex flex-col rounded-md border p-2 text-center text-xs transition-colors",
                    isCurrent
                      ? "border-primary bg-primary/10 font-semibold text-primary"
                      : isPast
                      ? "border-border bg-background text-foreground"
                      : "border-border/40 text-muted-foreground opacity-50"
                  )}
                >
                  <span className="text-[10px] text-muted-foreground">Step {idx + 1}</span>
                  <span className="truncate leading-tight">{st}</span>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <p className="font-semibold">Complaint Rejected</p>
          <p className="text-xs">{complaint.rejectionReason || "This complaint was reviewed and closed as rejected."}</p>
        </div>
      )}

      {/* History Log */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Audit Trail & Investigation History
        </p>
        {history && history.length > 0 ? (
          <div className="relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border flex flex-col gap-4">
            {history.map((h) => (
              <div key={h.id} className="relative flex flex-col gap-1">
                <span className="absolute -left-6 top-1 flex size-3 items-center justify-center rounded-full bg-primary" />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">{h.action}</span>
                  <span className="text-xs text-muted-foreground">{timeAgo(h.createdAt)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  By <strong className="font-medium text-foreground">{h.performedByName}</strong> ({h.performedByRole.toUpperCase()})
                </p>
                {h.remarks && (
                  <p className="mt-1 rounded bg-muted/40 p-2 text-xs text-foreground/90 whitespace-pre-wrap">
                    {h.remarks}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No history records yet.</p>
        )}
      </div>
    </div>
  )
}

export function ReportRaggingDialog({
  open,
  onOpenChange,
  onCreated,
  user,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
  user: PublicUser
}) {
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState<AntiRaggingCategory>("verbal_abuse")
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split("T")[0])
  const [incidentTime, setIncidentTime] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [peopleInvolved, setPeopleInvolved] = useState("")
  const [anonymous, setAnonymous] = useState(false)
  const [evidence, setEvidence] = useState("")
  const [attachments, setAttachments] = useState<EvidenceAttachment[]>([])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]
    const reader = new FileReader()
    reader.onload = () => {
      setAttachments((prev) => [
        ...prev,
        {
          name: file.name,
          size: file.size,
          type: file.type,
          url: String(reader.result),
        },
      ])
      toast.success(`Attached file: ${file.name}`)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim() || !location.trim()) {
      toast.error("Please fill in the incident location and description.")
      return
    }

    setLoading(true)
    try {
      await apiSend("/api/anti-ragging/complaints", "POST", {
        category,
        incidentDate,
        incidentTime,
        location,
        description,
        peopleInvolved,
        anonymous,
        evidence,
        evidenceAttachments: attachments,
        department: user.department || "General",
        year: user.year || "1st Year",
        section: user.section || "A",
      })

      toast.success("Anti-Ragging complaint submitted securely. It will be verified by the Admin.")
      onOpenChange(false)
      onCreated()
      // Reset form
      setDescription("")
      setLocation("")
      setPeopleInvolved("")
      setEvidence("")
      setAttachments([])
    } catch (err: any) {
      toast.error(err.message || "Failed to submit complaint.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="size-5" />
            <DialogTitle>Report Ragging Incident</DialogTitle>
          </div>
          <DialogDescription>
            Your report is strictly confidential and protected under UGC Anti-Ragging regulations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          {/* Identity Protection Notice */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
            <p className="font-semibold flex items-center gap-1.5">
              <Shield className="size-3.5" /> Confidential Reporting Guarantee
            </p>
            <p className="mt-0.5">
              Strict disciplinary and legal action will be taken. If you select anonymous, your name and email will be masked from non-administrative staff.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Type / Category of Ragging *</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as AntiRaggingCategory)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AR_CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="incidentDate">Date of Incident *</Label>
              <Input
                id="incidentDate"
                type="date"
                required
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="incidentTime">Time of Incident (Optional)</Label>
              <Input
                id="incidentTime"
                type="time"
                value={incidentTime}
                onChange={(e) => setIncidentTime(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="location">Incident Location *</Label>
              <Input
                id="location"
                placeholder="e.g. Hostel Block C 2nd floor corridor"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="peopleInvolved">Perpetrators / People Involved *</Label>
            <Input
              id="peopleInvolved"
              placeholder="Names, branch, year, room numbers or identifying descriptions"
              required
              value={peopleInvolved}
              onChange={(e) => setPeopleInvolved(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Detailed Description of Incident *</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Describe exactly what happened, what was said or done, and if there were any witnesses..."
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="evidence">Witness Statements / Evidence Notes</Label>
            <Input
              id="evidence"
              placeholder="e.g. 2 roommates witnessed the incident; security camera nearby"
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="file">Upload Photo / Document Evidence (Optional)</Label>
            <Input id="file" type="file" onChange={handleFileChange} />
            {attachments.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-2">
                {attachments.map((a, i) => (
                  <Badge key={i} variant="secondary" className="gap-1 text-xs">
                    <Paperclip className="size-3" /> {a.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border p-3">
            <input
              type="checkbox"
              id="anonymous"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <div className="flex flex-col">
              <Label htmlFor="anonymous" className="font-semibold cursor-pointer">
                Submit this complaint anonymously
              </Label>
              <span className="text-xs text-muted-foreground">
                Your name and student email will not be displayed to department investigators.
              </span>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={loading}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Submit Complaint
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
