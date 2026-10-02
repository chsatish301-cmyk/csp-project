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
      { error: "Forbidden: Only administrators can assign complaints to HODs." },
      { status: 403 }
    )
  }

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const { hodId, department, remarks } = body

  if (!hodId) {
    return NextResponse.json({ error: "HOD ID is required." }, { status: 400 })
  }

  const complaints = db.antiRaggingComplaints || []
  const complaint = complaints.find(
    (c) => c.id === id || c.complaintId.toLowerCase() === id.toLowerCase()
  )

  if (!complaint) {
    return NextResponse.json({ error: "Complaint not found" }, { status: 404 })
  }

  const hodUser = db.users.find((u) => u.id === hodId && (u.role === "hod" || u.role === "admin"))
  if (!hodUser) {
    return NextResponse.json({ error: "Selected HOD was not found." }, { status: 404 })
  }

  const now = new Date().toISOString()
  const isReassign = Boolean(complaint.assignedHod && complaint.assignedHod !== hodId)

  complaint.status = "Assigned to HOD"
  complaint.assignedHod = hodUser.id
  complaint.assignedHodName = hodUser.name
  complaint.assignedDepartment = department || hodUser.department || complaint.department
  complaint.assignedAt = now
  complaint.updatedAt = now

  const actionTitle = isReassign ? `Reassigned to HOD (${hodUser.name})` : `Assigned to HOD (${hodUser.name})`
  const actionRemarks = remarks
    ? String(remarks)
    : `Complaint ${isReassign ? "reassigned" : "assigned"} by Admin to ${hodUser.name} (${complaint.assignedDepartment} Department).`

  const actionLog: ComplaintAction = {
    id: uid("h"),
    complaintId: complaint.id,
    performedBy: user.id,
    performedByName: user.name,
    performedByRole: "admin",
    action: actionTitle,
    remarks: actionRemarks,
    status: "Assigned to HOD",
    createdAt: now,
  }

  if (!db.antiRaggingHistory) {
    db.antiRaggingHistory = []
  }
  db.antiRaggingHistory.push(actionLog)

  // Notify HOD
  db.notifications.push({
    id: uid("n"),
    userId: hodUser.id,
    message: `Anti-Ragging complaint ${complaint.complaintId} has been assigned to you for investigation.`,
    href: "/hod/complaints",
    read: false,
    createdAt: now,
  })

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
      message: `Your complaint ${complaint.complaintId} has been assigned to HOD ${complaint.assignedDepartment} for investigation.`,
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
