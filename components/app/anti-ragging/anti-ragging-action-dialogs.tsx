"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  FileCheck2,
  FileText,
  Loader2,
  Lock,
  MapPin,
  Paperclip,
  Shield,
  ShieldAlert,
  User,
  UserCheck,
  Users,
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { apiSend, AR_CATEGORY_LABELS, AR_STATUS_LABELS } from "@/lib/client"
import type {
  AntiRaggingComplaint,
  AntiRaggingStatus,
  ComplaintAction,
  EvidenceAttachment,
  PublicUser,
} from "@/lib/types"
import { AntiRaggingStatusBadge, ComplaintTimeline } from "./anti-ragging-dialogs"

// -------------------------------------------------------------
// ADMIN MODAL: Verify, Assign to HOD, Audit, Monitor
// -------------------------------------------------------------
export function AdminManageComplaintModal({
  complaint,
  open,
  onOpenChange,
  onUpdated,
  hodList,
}: {
  complaint: AntiRaggingComplaint | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
  hodList: PublicUser[]
}) {
  const [history, setHistory] = useState<ComplaintAction[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [busy, setBusy] = useState(false)

  // Assign state
  const [selectedHodId, setSelectedHodId] = useState("")
  const [assignRemarks, setAssignRemarks] = useState("")

  // Verify state
  const [verifyRemarks, setVerifyRemarks] = useState("")

  useEffect(() => {
    if (!complaint || !open) return
    setSelectedHodId(complaint.assignedHod || "")
    setAssignRemarks("")
    setVerifyRemarks("")
    setLoadingHistory(true)
    apiSend<{ history: ComplaintAction[] }>(`/api/anti-ragging/complaints/${complaint.id}/history`, "GET")
      .then((res) => setHistory(res.history || []))
      .catch(() => setHistory([]))
      .finally(() => setLoadingHistory(false))
  }, [complaint, open])

  if (!complaint) return null

  async function handleVerify() {
    setBusy(true)
    try {
      await apiSend(`/api/anti-ragging/complaints/${complaint!.id}/verify`, "PUT", {
        remarks: verifyRemarks.trim() || undefined,
      })
      toast.success("Complaint verified and moved to Under Review.")
      onUpdated()
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message || "Failed to verify complaint.")
    } finally {
      setBusy(false)
    }
  }

  async function handleAssign() {
    if (!selectedHodId) {
      toast.error("Please select an HOD.")
      return
    }
    setBusy(true)
    try {
      await apiSend(`/api/anti-ragging/complaints/${complaint!.id}/assign`, "PUT", {
        hodId: selectedHodId,
        remarks: assignRemarks.trim() || undefined,
      })
      toast.success("Complaint assigned to HOD for investigation.")
      onUpdated()
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message || "Failed to assign complaint.")
    } finally {
      setBusy(false)
    }
  }

  async function handleCloseResolved() {
    setBusy(true)
    try {
      await apiSend(`/api/anti-ragging/complaints/${complaint!.id}/status`, "PUT", {
        status: "Resolved",
        remarks: "Complaint closed and resolved by Administrator audit.",
      })
      toast.success("Complaint marked as Resolved.")
      onUpdated()
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message || "Failed to update status.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-primary" />
              <DialogTitle className="text-lg font-bold">
                {complaint.complaintId} — {AR_CATEGORY_LABELS[complaint.category] || complaint.category}
              </DialogTitle>
            </div>
            <AntiRaggingStatusBadge status={complaint.status} />
          </div>
          <DialogDescription>
            Admin Verification, HOD Assignment, Investigation Progress & Audit Trail
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-2">
          {/* Incident Overview Card */}
          <div className="rounded-lg border border-border bg-card p-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Complainant</p>
                <p className="font-semibold">
                  {complaint.anonymous ? (
                    <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                      <Lock className="size-3" /> Anonymous Student
                    </span>
                  ) : (
                    complaint.studentName
                  )}
                </p>
                {!complaint.anonymous && (
                  <p className="text-xs text-muted-foreground">{complaint.studentEmail} · {complaint.studentId}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Department & Year</p>
                <p className="font-semibold">{complaint.department} ({complaint.year || "N/A"})</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Incident Date & Location</p>
                <p className="font-semibold flex items-center gap-1">
                  <MapPin className="size-3 shrink-0 text-muted-foreground" /> {complaint.location}
                </p>
                <p className="text-xs text-muted-foreground">{complaint.incidentDate}</p>
              </div>
            </div>

            <Separator className="my-3" />

            <div>
              <p className="text-xs font-semibold text-muted-foreground">People Involved</p>
              <p className="mt-0.5 text-xs text-foreground/90">{complaint.peopleInvolved}</p>
            </div>

            <div className="mt-3">
              <p className="text-xs font-semibold text-muted-foreground">Incident Description</p>
              <p className="mt-1 rounded bg-muted/30 p-2.5 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>

            {complaint.evidence && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-muted-foreground">Evidence / Witness Notes</p>
                <p className="mt-1 text-xs text-muted-foreground">{complaint.evidence}</p>
              </div>
            )}

            {complaint.evidenceAttachments && complaint.evidenceAttachments.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {complaint.evidenceAttachments.map((a, i) => (
                  <Badge key={i} variant="outline" className="gap-1.5 text-xs">
                    <Paperclip className="size-3" /> {a.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Investigation & Action Taken summary if available */}
          {(complaint.investigationNotes || complaint.actionTaken || complaint.assignedHodName) && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                HOD Investigation & Action Summary
              </p>
              <div className="grid gap-2 sm:grid-cols-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Assigned HOD:</span>{" "}
                  <strong>{complaint.assignedHodName || "None"}</strong> ({complaint.assignedDepartment || complaint.department})
                </div>
                {complaint.actionTakenAt && (
                  <div>
                    <span className="text-muted-foreground">Action Date:</span>{" "}
                    <strong>{new Date(complaint.actionTakenAt).toLocaleDateString()}</strong>
                  </div>
                )}
              </div>
              {complaint.investigationNotes && (
                <div className="text-xs">
                  <span className="text-muted-foreground font-semibold">Investigation Notes:</span>
                  <p className="mt-0.5 whitespace-pre-wrap">{complaint.investigationNotes}</p>
                </div>
              )}
              {complaint.actionTaken && (
                <div className="text-xs">
                  <span className="text-muted-foreground font-semibold">Disciplinary / Administrative Action:</span>
                  <p className="mt-0.5 font-medium text-foreground whitespace-pre-wrap">{complaint.actionTaken}</p>
                </div>
              )}
            </div>
          )}

          {/* Admin Workflow Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* 1. Verify Card */}
            <div className="flex flex-col justify-between rounded-lg border border-border p-4">
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  <CheckCircle2 className="size-4 text-purple-600 dark:text-purple-400" />
                  <span>Step 1: Verify Complaint</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Confirm complaint authenticity and put it Under Review.
                </p>
                {complaint.verifiedAt ? (
                  <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    ✓ Verified by {complaint.verifiedByName} on {new Date(complaint.verifiedAt).toLocaleDateString()}
                  </p>
                ) : (
                  <div className="mt-3 flex flex-col gap-2">
                    <Input
                      placeholder="Verification notes (optional)..."
                      className="text-xs"
                      value={verifyRemarks}
                      onChange={(e) => setVerifyRemarks(e.target.value)}
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleVerify}
                      disabled={busy}
                    >
                      {busy && <Loader2 className="mr-1.5 size-3 animate-spin" />}
                      Verify & Mark Under Review
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Assign to HOD Card */}
            <div className="flex flex-col justify-between rounded-lg border border-border p-4">
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  <UserCheck className="size-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Step 2: Assign / Reassign to HOD</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Route to department HOD/Sub-Admin to carry out investigation and action.
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <Select value={selectedHodId} onValueChange={setSelectedHodId}>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Select Department HOD..." />
                    </SelectTrigger>
                    <SelectContent>
                      {hodList.map((h) => (
                        <SelectItem key={h.id} value={h.id}>
                          {h.name} ({h.department || "Admin"})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Assignment instructions (optional)..."
                    className="text-xs"
                    value={assignRemarks}
                    onChange={(e) => setAssignRemarks(e.target.value)}
                  />
                  <Button
                    size="sm"
                    onClick={handleAssign}
                    disabled={busy || !selectedHodId}
                  >
                    {busy && <Loader2 className="mr-1.5 size-3 animate-spin" />}
                    {complaint.assignedHod ? "Reassign HOD" : "Assign to HOD"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline & Audit History */}
          <ComplaintTimeline complaint={complaint} history={history} />
        </div>

        <DialogFooter className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          {complaint.status !== "Resolved" ? (
            <Button variant="outline" size="sm" onClick={handleCloseResolved} disabled={busy}>
              Close & Mark Resolved
            </Button>
          ) : (
            <span className="text-xs font-medium text-emerald-600">Complaint is Resolved</span>
          )}
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// -------------------------------------------------------------
// HOD MODAL: Investigate, Record Action, Update Status
// -------------------------------------------------------------
export function HodInvestigationModal({
  complaint,
  open,
  onOpenChange,
  onUpdated,
}: {
  complaint: AntiRaggingComplaint | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}) {
  const [history, setHistory] = useState<ComplaintAction[]>([])
  const [busy, setBusy] = useState(false)

  // Investigation form
  const [status, setStatus] = useState<AntiRaggingStatus>("Investigation in Progress")
  const [investigationNotes, setInvestigationNotes] = useState("")
  const [actionTaken, setActionTaken] = useState("")
  const [resolutionRemarks, setResolutionRemarks] = useState("")

  useEffect(() => {
    if (!complaint || !open) return
    setStatus(complaint.status)
    setInvestigationNotes(complaint.investigationNotes || "")
    setActionTaken(complaint.actionTaken || "")
    setResolutionRemarks(complaint.resolutionRemarks || "")

    apiSend<{ history: ComplaintAction[] }>(`/api/anti-ragging/complaints/${complaint.id}/history`, "GET")
      .then((res) => setHistory(res.history || []))
      .catch(() => setHistory([]))
  }, [complaint, open])

  if (!complaint) return null

  async function handleSaveInvestigation() {
    setBusy(true)
    try {
      await apiSend(`/api/anti-ragging/complaints/${complaint!.id}/actions`, "POST", {
        action: status === "Resolved" ? "Complaint Resolved by HOD" : "Investigation Updated by HOD",
        status,
        investigationNotes: investigationNotes.trim() || undefined,
        actionTaken: actionTaken.trim() || undefined,
        resolutionRemarks: resolutionRemarks.trim() || undefined,
        remarks: actionTaken.trim()
          ? `Disciplinary/Administrative action recorded: ${actionTaken.trim()}`
          : investigationNotes.trim()
          ? `Investigation progress: ${investigationNotes.trim()}`
          : `Status updated to ${status}.`,
      })
      toast.success("Investigation details saved and student notified.")
      onUpdated()
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message || "Failed to update investigation.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileCheck2 className="size-5 text-primary" />
              <DialogTitle className="text-lg font-bold">
                {complaint.complaintId} — Investigation & Action Record
              </DialogTitle>
            </div>
            <AntiRaggingStatusBadge status={complaint.status} />
          </div>
          <DialogDescription>
            Conduct inquiry, interview involved parties, review evidence, and record disciplinary actions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {/* Incident Details for HOD */}
          <div className="rounded-lg border border-border bg-card p-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Complainant</p>
                <p className="font-semibold">
                  {complaint.anonymous ? (
                    <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                      <Lock className="size-3" /> Anonymous Student
                    </span>
                  ) : (
                    complaint.studentName
                  )}
                </p>
                {!complaint.anonymous && (
                  <p className="text-xs text-muted-foreground">{complaint.studentEmail}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Department & Year</p>
                <p className="font-semibold">{complaint.department} ({complaint.year || "N/A"})</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Incident Date & Location</p>
                <p className="font-semibold">{complaint.location}</p>
                <p className="text-xs text-muted-foreground">{complaint.incidentDate}</p>
              </div>
            </div>

            <Separator className="my-3" />

            <div>
              <p className="text-xs font-semibold text-muted-foreground">People Involved</p>
              <p className="mt-0.5 text-xs font-medium text-foreground">{complaint.peopleInvolved}</p>
            </div>

            <div className="mt-3">
              <p className="text-xs font-semibold text-muted-foreground">Incident Description</p>
              <p className="mt-1 rounded bg-muted/30 p-2.5 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>

            {complaint.evidence && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-muted-foreground">Complainant Evidence / Witness Notes</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{complaint.evidence}</p>
              </div>
            )}
          </div>

          {/* Investigation Form Fields */}
          <div className="rounded-lg border border-border bg-muted/10 p-4 flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Update Investigation & Action Taken
            </p>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status">Investigation Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as AntiRaggingStatus)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Investigation in Progress">Investigation in Progress</SelectItem>
                  <SelectItem value="Action Taken">Action Taken</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="investigationNotes">Investigation Findings & Notes</Label>
              <Textarea
                id="investigationNotes"
                rows={3}
                placeholder="Details of inquiry, student statements taken, CCTV verification, or committee findings..."
                value={investigationNotes}
                onChange={(e) => setInvestigationNotes(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="actionTaken">Disciplinary / Administrative Action Taken</Label>
              <Textarea
                id="actionTaken"
                rows={3}
                placeholder="e.g. Warning letter issued, parents summoned, suspension, mandatory counseling, or restorative conference..."
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
              />
            </div>

            {status === "Resolved" && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="resolutionRemarks">Resolution Summary / Closure Remarks</Label>
                <Input
                  id="resolutionRemarks"
                  placeholder="Final remarks on resolution, student monitoring, and follow-up..."
                  value={resolutionRemarks}
                  onChange={(e) => setResolutionRemarks(e.target.value)}
                />
              </div>
            )}

            <Button onClick={handleSaveInvestigation} disabled={busy} className="self-end">
              {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save & Notify Student
            </Button>
          </div>

          {/* Timeline & History */}
          <ComplaintTimeline complaint={complaint} history={history} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// -------------------------------------------------------------
// STUDENT DETAILS MODAL: View full complaint & timeline
// -------------------------------------------------------------
export function StudentComplaintDetailsModal({
  complaint,
  open,
  onOpenChange,
}: {
  complaint: AntiRaggingComplaint | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [history, setHistory] = useState<ComplaintAction[]>([])

  useEffect(() => {
    if (!complaint || !open) return
    apiSend<{ history: ComplaintAction[] }>(`/api/anti-ragging/complaints/${complaint.id}/history`, "GET")
      .then((res) => setHistory(res.history || []))
      .catch(() => setHistory([]))
  }, [complaint, open])

  if (!complaint) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-primary" />
              <DialogTitle className="text-lg font-bold">
                {complaint.complaintId} — {AR_CATEGORY_LABELS[complaint.category] || complaint.category}
              </DialogTitle>
            </div>
            <AntiRaggingStatusBadge status={complaint.status} />
          </div>
          <DialogDescription>
            Submitted on {new Date(complaint.createdAt).toLocaleDateString()} · Incident at {complaint.location}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {/* Details Card */}
          <div className="rounded-lg border border-border bg-card p-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Department & Year</p>
                <p className="font-semibold">{complaint.department} ({complaint.year || "N/A"})</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Incident Date & Location</p>
                <p className="font-semibold">{complaint.location}</p>
                <p className="text-xs text-muted-foreground">{complaint.incidentDate}</p>
              </div>
            </div>

            <Separator className="my-3" />

            <div>
              <p className="text-xs font-semibold text-muted-foreground">Incident Description</p>
              <p className="mt-1 rounded bg-muted/30 p-2.5 text-xs text-foreground whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>

            {/* Action Taken if any */}
            {complaint.actionTaken && (
              <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Action Taken</p>
                <p className="mt-1 text-xs text-foreground whitespace-pre-wrap">{complaint.actionTaken}</p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <ComplaintTimeline complaint={complaint} history={history} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
