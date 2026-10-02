import { NextResponse } from "next/server"
import { db, saveDb, uid } from "@/lib/store"
import { getCurrentUser } from "@/lib/auth"
import type { ComplaintAction } from "@/lib/types"

export const dynamic = "force-dynamic"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Only administrators can verify complaints." },
      { status: 403 }
    )
  }

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const complaints = db.antiRaggingComplaints || []
  const complaint = complaints.find(
    (c) => c.id === id || c.complaintId.toLowerCase() === id.toLowerCase()
  )

  if (!complaint) {
    return NextResponse.json({ error: "Complaint not found" }, { status: 404 })
  }

  const now = new Date().toISOString()
  complaint.status = "Under Review"
  complaint.verifiedBy = user.id
  complaint.verifiedByName = user.name
  complaint.verifiedAt = now
  complaint.updatedAt = now

  const actionLog: ComplaintAction = {
    id: uid("h"),
    complaintId: complaint.id,
    performedBy: user.id,
    performedByName: user.name,
    performedByRole: "admin",
    action: "Complaint Verified",
    remarks: body.remarks ? String(body.remarks) : "Complaint details verified by Admin. Status updated to Under Review.",
    status: "Under Review",
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
      message: `Your complaint ${complaint.complaintId} has been verified by the Admin and is now Under Review.`,
      href: "/portal/anti-ragging",
      read: false,
      createdAt: now,
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
