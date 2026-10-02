import { NextResponse } from "next/server"
import { db } from "@/lib/store"
import { getCurrentUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const complaints = db.antiRaggingComplaints || []
  const complaint = complaints.find(
    (c) => c.id === id || c.complaintId.toLowerCase() === id.toLowerCase()
  )

  if (!complaint) {
    return NextResponse.json({ error: "Complaint not found" }, { status: 404 })
  }

  // RBAC checks
  if (user.role === "admin") {
    // Admin has access
  } else if (user.role === "hod") {
    const isAssigned =
      complaint.assignedHod === user.id ||
      (user.department && complaint.department?.toLowerCase() === user.department.toLowerCase())
    if (!isAssigned) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  } else if (user.role === "student") {
    const isOwner =
      complaint.studentEmail?.toLowerCase() === user.email.toLowerCase() ||
      (user.studentId && complaint.studentId === user.studentId)
    if (!isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const history = (db.antiRaggingHistory || [])
    .filter((h) => h.complaintId === complaint.id)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  return NextResponse.json({ history })
}
