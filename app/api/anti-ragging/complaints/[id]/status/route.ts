import { NextResponse } from "next/server"
import { db, saveDb, uid } from "@/lib/store"
import { getCurrentUser } from "@/lib/auth"
import type { AntiRaggingStatus, ComplaintAction } from "@/lib/types"

export const dynamic = "force-dynamic"

const VALID_STATUSES: AntiRaggingStatus[] = [
  "Submitted",
  "Under Review",
  "Assigned to HOD",
  "Investigation in Progress",
  "Action Taken",
  "Resolved",
  "Rejected",
]

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "admin" && user.role !== "hod") {
    return NextResponse.json(
      { error: "Forbidden: Students and unauthorized users cannot change complaint status." },
      { status: 403 }
    )
  }

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const { status, remarks } = body

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status. Valid values: ${VALID_STATUSES.join(", ")}` },
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

  // HOD permission check: must be assigned HOD or department
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
  const prevStatus = complaint.status
  complaint.status = status as AntiRaggingStatus
  complaint.updatedAt = now

  if (status === "Resolved") {
    complaint.resolvedAt = now
  }

  const actionLog: ComplaintAction = {
    id: uid("h"),
    complaintId: complaint.id,
    performedBy: user.id,
    performedByName: user.name,
    performedByRole: user.role,
    action: `Status Changed to ${status}`,
    remarks: remarks ? String(remarks) : `Status updated from ${prevStatus} to ${status}.`,
    status: status as AntiRaggingStatus,
    createdAt: now,
  }

  if (!db.antiRaggingHistory) {
    db.antiRaggingHistory = []
  }
  db.antiRaggingHistory.push(actionLog)

  // Notify student
  const studentUser = db.users.find(
    (u) =>
      u.email.toLowerCase() === complaint.studentEmail.toLowerCase() ||
      (complaint.studentId && u.studentId === complaint.studentId)
  )
  if (studentUser) {
    db.notifications.push({
      id: uid("n"),
      userId: studentUser.id,
      message: `Your complaint ${complaint.complaintId} status changed to ${status}.`,
      href: "/portal/anti-ragging",
      read: false,
      createdAt: now,
    })
  }

  // If HOD updated status, notify admin
  if (user.role === "hod") {
    const admins = db.users.filter((u) => u.role === "admin")
    admins.forEach((admin) => {
      db.notifications.push({
        id: uid("n"),
        userId: admin.id,
        message: `HOD ${user.name} updated complaint ${complaint.complaintId} status to ${status}.`,
        href: "/admin/anti-ragging",
        read: false,
        createdAt: now,
      })
    })
  }

  saveDb()

  return NextResponse.json({ ok: true, complaint })
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return PUT(req, context)
}
