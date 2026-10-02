import { NextResponse } from "next/server"
import { db, saveDb, uid, nextArCode } from "@/lib/store"
import { getCurrentUser } from "@/lib/auth"
import type { AntiRaggingComplaint, ComplaintAction, AntiRaggingCategory } from "@/lib/types"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const search = (searchParams.get("search") || "").trim().toLowerCase()
  const status = searchParams.get("status")
  const department = searchParams.get("department")
  const dateFrom = searchParams.get("from")
  const dateTo = searchParams.get("to")

  let list = db.antiRaggingComplaints || []

  // Role based filtering
  if (user.role === "admin") {
    // Admin sees all
  } else if (user.role === "hod") {
    // HOD only sees assigned to them or their department
    list = list.filter(
      (c) =>
        c.assignedHod === user.id ||
        (user.department && c.department?.toLowerCase() === user.department.toLowerCase())
    )
    // Mask identity if anonymous
    list = list.map((c) => {
      if (c.anonymous) {
        return {
          ...c,
          studentName: "Anonymous Student",
          studentEmail: "[Confidential]",
          studentId: "[Confidential]",
        }
      }
      return c
    })
  } else if (user.role === "student") {
    // Student only sees their own
    list = list.filter(
      (c) =>
        c.studentEmail?.toLowerCase() === user.email.toLowerCase() ||
        (user.studentId && c.studentId === user.studentId)
    )
  } else {
    return NextResponse.json({ error: "Access denied" }, { status: 403 })
  }

  // Filters
  if (status && status !== "all") {
    list = list.filter((c) => c.status.toLowerCase() === status.toLowerCase())
  }
  if (department && department !== "all") {
    list = list.filter((c) => c.department.toLowerCase() === department.toLowerCase())
  }
  if (dateFrom) {
    list = list.filter((c) => c.incidentDate >= dateFrom)
  }
  if (dateTo) {
    list = list.filter((c) => c.incidentDate <= dateTo)
  }
  if (search) {
    list = list.filter(
      (c) =>
        c.complaintId.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search) ||
        c.location.toLowerCase().includes(search) ||
        c.category.toLowerCase().includes(search) ||
        (c.peopleInvolved && c.peopleInvolved.toLowerCase().includes(search)) ||
        (!c.anonymous && c.studentName.toLowerCase().includes(search))
    )
  }

  // Sort latest first
  list.sort((a, b) => (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))

  return NextResponse.json({ complaints: list })
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const {
    category,
    incidentDate,
    incidentTime,
    location,
    description,
    peopleInvolved,
    anonymous,
    evidence,
    evidenceAttachments,
    department,
    year,
    section,
  } = body

  if (!category || !incidentDate || !location || !description) {
    return NextResponse.json(
      { error: "Category, incident date, location, and description are required." },
      { status: 400 }
    )
  }

  const code = nextArCode()
  const newComplaintId = uid("ar_c")
  const now = new Date().toISOString()

  const complaint: AntiRaggingComplaint = {
    id: newComplaintId,
    complaintId: code,
    studentId: user.studentId || `STU-${user.id.slice(-4).toUpperCase()}`,
    studentName: user.name,
    studentEmail: user.email,
    department: department || user.department || "General",
    year: year || user.year || "1st Year",
    section: section || user.section || "A",
    category: category as AntiRaggingCategory,
    incidentDate: String(incidentDate),
    incidentTime: incidentTime ? String(incidentTime) : undefined,
    location: String(location),
    description: String(description),
    peopleInvolved: peopleInvolved ? String(peopleInvolved) : "Not specified",
    anonymous: Boolean(anonymous),
    evidence: evidence ? String(evidence) : "",
    evidenceAttachments: Array.isArray(evidenceAttachments) ? evidenceAttachments : [],
    status: "Submitted",
    verifiedBy: null,
    verifiedByName: null,
    verifiedAt: null,
    assignedHod: null,
    assignedHodName: null,
    assignedDepartment: null,
    assignedAt: null,
    investigationNotes: null,
    actionTaken: null,
    actionTakenAt: null,
    resolutionRemarks: null,
    rejectionReason: null,
    createdAt: now,
    updatedAt: now,
    resolvedAt: null,
  }

  if (!db.antiRaggingComplaints) {
    db.antiRaggingComplaints = []
  }
  db.antiRaggingComplaints.push(complaint)

  // Add initial complaint action log
  const initialAction: ComplaintAction = {
    id: uid("h"),
    complaintId: complaint.id,
    performedBy: user.id,
    performedByName: complaint.anonymous ? "Anonymous Student" : user.name,
    performedByRole: user.role,
    action: "Complaint Submitted",
    remarks: "Anti-Ragging complaint submitted by student.",
    status: "Submitted",
    createdAt: now,
  }

  if (!db.antiRaggingHistory) {
    db.antiRaggingHistory = []
  }
  db.antiRaggingHistory.push(initialAction)

  // Notify Admins
  const admins = db.users.filter((u) => u.role === "admin")
  admins.forEach((admin) => {
    db.notifications.push({
      id: uid("n"),
      userId: admin.id,
      message: `New Anti-Ragging complaint ${complaint.complaintId} submitted in ${complaint.department} department.`,
      href: "/admin/anti-ragging",
      read: false,
      createdAt: now,
    })
  })

  saveDb()

  return NextResponse.json({ complaint }, { status: 201 })
}
