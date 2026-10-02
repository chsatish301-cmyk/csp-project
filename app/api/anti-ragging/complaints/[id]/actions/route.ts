import { NextResponse } from "next/server"
import { db, saveDb, uid } from "@/lib/store"
import { getCurrentUser } from "@/lib/auth"
import type { AntiRaggingStatus, ComplaintAction } from "@/lib/types"

export const dynamic = "force-dynamic"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "admin" && user.role !== "hod") {
    return NextResponse.json(
      { error: "Forbidden: Only HOD or Administrator can record actions on complaints." },
      { status: 403 }
    )
  }

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const {
    action,
    remarks,
    actionTaken,
    investigationNotes,
    resolutionRemarks,
    status,
    evidenceAttachments,
  } = body

  if (!action && !remarks && !actionTaken && !investigationNotes) {
    return NextResponse.json(
      { error: "Action or remarks description is required." },
      { status: 400 }
    )
  }

  const complaints = db.antiRaggingComplaints || []
  const complaint = complaints.find(
    (c) => c.id === id || c.complaintId.toLowerCase() === id.toLowerCase()
  )

  if (!complaint) {
    return NextResponse.json({ error: "Complaint not found" }, { status: 404 })
  }

  // HOD authorization check
  if (user.role === "hod") {
    const isAssigned =
      complaint.assignedHod === user.id ||
      (user.department && complaint.department?.toLowerCase() === user.department.toLowerCase())
    if (!isAssigned) {
      return NextResponse.json(
        { error: "Forbidden: You are not assigned to this complaint." },
        { status: 403 }
      )
    }
  }

  const now = new Date().toISOString()

  if (actionTaken) {
    complaint.actionTaken = String(actionTaken)
    complaint.actionTakenAt = now
  }
  if (investigationNotes) {
    complaint.investigationNotes = String(investigationNotes)
  }
  if (resolutionRemarks) {
    complaint.resolutionRemarks = String(resolutionRemarks)
  }
  if (status) {
    complaint.status = status as AntiRaggingStatus
    if (status === "Resolved") {
      complaint.resolvedAt = now
    }
  }
  if (Array.isArray(evidenceAttachments) && evidenceAttachments.length > 0) {
    if (!complaint.evidenceAttachments) complaint.evidenceAttachments = []
    complaint.evidenceAttachments.push(...evidenceAttachments)
  }

  complaint.updatedAt = now

  const actionLog: ComplaintAction = {
    id: uid("h"),
    complaintId: complaint.id,
    performedBy: user.id,
    performedByName: user.name,
    performedByRole: user.role,
    action: action ? String(action) : actionTaken ? "Action Recorded" : "Investigation Updated",
    remarks: remarks ? String(remarks) : actionTaken ? String(actionTaken) : "Investigation update logged.",
    status: complaint.status,
    createdAt: now,
  }

  if (!db.antiRaggingHistory) {
    db.antiRaggingHistory = []
  }
  db.antiRaggingHistory.push(actionLog)

  // Notify Student
  const studentUser = db.users.find(
    (u) =>
      u.email.toLowerCase() === complaint.studentEmail.toLowerCase() ||
      (complaint.studentId && u.studentId === complaint.studentId)
  )
  if (studentUser) {
    db.notifications.push({
      id: uid("n"),
      userId: studentUser.id,
      message: `Update on complaint ${complaint.complaintId}: ${actionLog.action}`,
      href: "/portal/anti-ragging",
      read: false,
      createdAt: now,
    })
  }

  // Notify Admin if HOD recorded action
  if (user.role === "hod") {
    const admins = db.users.filter((u) => u.role === "admin")
    admins.forEach((admin) => {
      db.notifications.push({
        id: uid("n"),
        userId: admin.id,
        message: `HOD ${user.name} recorded action on complaint ${complaint.complaintId}.`,
        href: "/admin/anti-ragging",
        read: false,
        createdAt: now,
      })
    })
  }

  saveDb()

  return NextResponse.json({ ok: true, complaint, action: actionLog })
}
