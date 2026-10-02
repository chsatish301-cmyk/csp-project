import type {
  Announcement,
  AntiRaggingComplaint,
  AntiRaggingStatus,
  Complaint,
  ComplaintAction,
  LostFoundItem,
  Notification,
  Resource,
  User,
} from "./types"

export interface DB {
  users: User[]
  resources: Resource[]
  complaints: Complaint[]
  antiRaggingComplaints: AntiRaggingComplaint[]
  antiRaggingHistory: ComplaintAction[]
  lostFound: LostFoundItem[]
  notifications: Notification[]
  announcements: Announcement[]
  sessions: Map<string, string> // sessionId -> userId
  seq: number
  arSeq: number
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function seed(): DB {
  const users: User[] = [
    {
      id: "u_admin",
      name: "Ava Admin",
      email: "admin@campus.edu",
      password: "vivek@2006",
      role: "admin",
      department: "Administration",
      hostel: null,
      createdAt: daysAgo(120),
    },
    {
      id: "u_maint1",
      name: "Marco Fields",
      email: "maintenance@campus.edu",
      password: "vivek@2006",
      role: "maintenance",
      department: "Facilities",
      hostel: null,
      createdAt: daysAgo(110),
    },
    {
      id: "u_maint2",
      name: "Nadia Rivers",
      email: "nadia@campus.edu",
      password: "vivek@2006",
      role: "maintenance",
      department: "Facilities",
      hostel: null,
      createdAt: daysAgo(90),
    },
    {
      id: "u_student",
      name: "Sam Student",
      email: "student@campus.edu",
      password: "vivek@2006",
      role: "student",
      department: "CSE",
      hostel: "Block C",
      studentId: "STU-2026-001",
      year: "2nd Year",
      section: "A",
      mobileNumber: "9876543210",
      createdAt: daysAgo(60),
    },
    {
      id: "u_hod_cse",
      name: "Dr. Alan Turing",
      email: "hod.cse@campus.edu",
      password: "vivek@2006",
      role: "hod",
      department: "CSE",
      hostel: null,
      employeeId: "EMP-HOD-CSE",
      mobileNumber: "9876500002",
      createdAt: daysAgo(100),
    },
    {
      id: "u_hod_ece",
      name: "Dr. Claude Shannon",
      email: "hod.ece@campus.edu",
      password: "vivek@2006",
      role: "hod",
      department: "ECE",
      hostel: null,
      employeeId: "EMP-HOD-ECE",
      mobileNumber: "9876500003",
      createdAt: daysAgo(100),
    },
    {
      id: "u_hod_mech",
      name: "Dr. Nikola Tesla",
      email: "hod.mech@campus.edu",
      password: "vivek@2006",
      role: "hod",
      department: "Mechanical",
      hostel: null,
      employeeId: "EMP-HOD-MECH",
      mobileNumber: "9876500004",
      createdAt: daysAgo(100),
    },
    {
      id: "u_hod_civil",
      name: "Dr. Arthur Thomas",
      email: "hod.civil@campus.edu",
      password: "vivek@2006",
      role: "hod",
      department: "Civil",
      hostel: null,
      employeeId: "EMP-HOD-CIVIL",
      mobileNumber: "9876500005",
      createdAt: daysAgo(100),
    },
    {
      id: "u_faculty",
      name: "Dr. Farah Lee",
      email: "faculty@campus.edu",
      password: "vivek@2006",
      role: "faculty",
      department: "Physics",
      hostel: null,
      createdAt: daysAgo(80),
    },
  ]

  const resources: Resource[] = [
    { id: "res_1", name: "AC Unit - LH101", type: "Air Conditioner", location: "Lecture Hall 101", createdAt: daysAgo(200) },
    { id: "res_2", name: "Projector - LH101", type: "Projector", location: "Lecture Hall 101", createdAt: daysAgo(200) },
    { id: "res_3", name: "Water Cooler - Block C", type: "Water Cooler", location: "Block C, Ground Floor", createdAt: daysAgo(200) },
    { id: "res_4", name: "Elevator - Library", type: "Elevator", location: "Central Library", createdAt: daysAgo(200) },
    { id: "res_5", name: "WiFi AP - Hostel C3", type: "Network", location: "Block C, 3rd Floor", createdAt: daysAgo(200) },
  ]

  const complaints: Complaint[] = [
    {
      id: "c_1",
      code: "CMP-1001",
      title: "AC not cooling in LH101",
      description: "The air conditioner runs but does not cool the room during afternoon lectures.",
      category: "electrical",
      priority: "high",
      location: "Lecture Hall 101",
      resourceId: "res_1",
      status: "assigned",
      submittedById: "u_faculty",
      submittedByName: "Dr. Farah Lee",
      assignedToId: "u_maint1",
      assignedToName: "Marco Fields",
      feedback: null,
      createdAt: daysAgo(3),
      updatedAt: daysAgo(2),
    },
    {
      id: "c_2",
      code: "CMP-1002",
      title: "Leaking tap in Block C washroom",
      description: "Continuous water leak from the second tap. Wasting water.",
      category: "plumbing",
      priority: "medium",
      location: "Block C, Ground Floor",
      resourceId: null,
      status: "in_progress",
      submittedById: "u_student",
      submittedByName: "Sam Student",
      assignedToId: "u_maint2",
      assignedToName: "Nadia Rivers",
      feedback: null,
      createdAt: daysAgo(5),
      updatedAt: daysAgo(1),
    },
    {
      id: "c_3",
      code: "CMP-1003",
      title: "WiFi down on 3rd floor",
      description: "No internet connectivity in hostel Block C 3rd floor since morning.",
      category: "network",
      priority: "urgent",
      location: "Block C, 3rd Floor",
      resourceId: "res_5",
      status: "resolved",
      submittedById: "u_student",
      submittedByName: "Sam Student",
      assignedToId: "u_maint1",
      assignedToName: "Marco Fields",
      feedback: { rating: 5, comment: "Fixed within hours, great job!", createdAt: daysAgo(1) },
      createdAt: daysAgo(8),
      updatedAt: daysAgo(6),
    },
  ]

  const antiRaggingComplaints: AntiRaggingComplaint[] = [
    {
      id: "ar_c_1",
      complaintId: "AR-2026-000001",
      studentId: "STU-2026-001",
      studentName: "Sam Student",
      studentEmail: "student@campus.edu",
      department: "CSE",
      year: "1st Year",
      section: "A",
      category: "verbal_abuse",
      incidentDate: daysAgo(3).split("T")[0],
      location: "Hostel Block C Entrance",
      description: "Senior students repeatedly subjected 1st year students to abusive language and forced them to perform degrading chores near the Hostel C entrance at night.",
      peopleInvolved: "3 senior students (3rd Year CSE)",
      anonymous: false,
      evidence: "Witness statements collected from hostel roommates.",
      evidenceAttachments: [],
      status: "Assigned to HOD",
      verifiedBy: "u_admin",
      verifiedByName: "Ava Admin",
      verifiedAt: daysAgo(2),
      assignedHod: "u_hod_cse",
      assignedHodName: "Dr. Alan Turing",
      assignedDepartment: "CSE",
      assignedAt: daysAgo(2),
      investigationNotes: null,
      actionTaken: null,
      actionTakenAt: null,
      resolutionRemarks: null,
      rejectionReason: null,
      createdAt: daysAgo(3),
      updatedAt: daysAgo(2),
      resolvedAt: null,
    },
    {
      id: "ar_c_2",
      complaintId: "AR-2026-000002",
      studentId: "STU-2026-001",
      studentName: "Sam Student",
      studentEmail: "student@campus.edu",
      department: "CSE",
      year: "1st Year",
      section: "B",
      category: "hostile_behavior",
      incidentDate: daysAgo(7).split("T")[0],
      location: "Central Cafeteria Ground Floor",
      description: "Aggressive behavior and intimidation noticed during lunch hours where senior students blocked junior students from entering the seating area.",
      peopleInvolved: "Group of 4 students",
      anonymous: false,
      evidence: "CCTV footage requested and verified with campus security.",
      evidenceAttachments: [],
      status: "Resolved",
      verifiedBy: "u_admin",
      verifiedByName: "Ava Admin",
      verifiedAt: daysAgo(6),
      assignedHod: "u_hod_cse",
      assignedHodName: "Dr. Alan Turing",
      assignedDepartment: "CSE",
      assignedAt: daysAgo(6),
      investigationNotes: "Security camera footage verified presence of perpetrators and aggressive conduct.",
      actionTaken: "Investigation conducted with CCTV footage. The identified students were summoned, issued formal disciplinary warnings with parental notification, and mandated anti-ragging counseling.",
      actionTakenAt: daysAgo(3),
      resolutionRemarks: "Disciplinary hearing completed. Written apologies submitted and hostel warden notified. Follow-up monitoring scheduled.",
      rejectionReason: null,
      createdAt: daysAgo(7),
      updatedAt: daysAgo(2),
      resolvedAt: daysAgo(2),
    },
    {
      id: "ar_c_3",
      complaintId: "AR-2026-000003",
      studentId: "STU-2026-001",
      studentName: "Sam Student",
      studentEmail: "student@campus.edu",
      department: "ECE",
      year: "1st Year",
      section: "C",
      category: "cyber_ragging",
      incidentDate: daysAgo(1).split("T")[0],
      location: "Online / WhatsApp Group",
      description: "Offensive memes and targeted insults against junior students were circulated in an unofficial department group by seniors.",
      peopleInvolved: "Group admin and 2 contributors",
      anonymous: true,
      evidence: "Screenshots of chats saved.",
      evidenceAttachments: [],
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
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
      resolvedAt: null,
    },
  ]

  const antiRaggingHistory: ComplaintAction[] = [
    {
      id: "h_1",
      complaintId: "ar_c_1",
      performedBy: "u_student",
      performedByName: "Sam Student",
      performedByRole: "student",
      action: "Complaint Submitted",
      remarks: "Anti-Ragging complaint submitted by student.",
      status: "Submitted",
      createdAt: daysAgo(3),
    },
    {
      id: "h_2",
      complaintId: "ar_c_1",
      performedBy: "u_admin",
      performedByName: "Ava Admin",
      performedByRole: "admin",
      action: "Verified & Assigned to HOD CSE",
      remarks: "Admin verified complaint details and assigned to Dr. Alan Turing (CSE Department).",
      status: "Assigned to HOD",
      createdAt: daysAgo(2),
    },
    {
      id: "h_3",
      complaintId: "ar_c_2",
      performedBy: "u_student",
      performedByName: "Sam Student",
      performedByRole: "student",
      action: "Complaint Submitted",
      remarks: "Anti-Ragging incident reported in Central Cafeteria.",
      status: "Submitted",
      createdAt: daysAgo(7),
    },
    {
      id: "h_4",
      complaintId: "ar_c_2",
      performedBy: "u_admin",
      performedByName: "Ava Admin",
      performedByRole: "admin",
      action: "Verified & Assigned to HOD CSE",
      remarks: "Admin verified preliminary details and assigned to HOD CSE.",
      status: "Assigned to HOD",
      createdAt: daysAgo(6),
    },
    {
      id: "h_5",
      complaintId: "ar_c_2",
      performedBy: "u_hod_cse",
      performedByName: "Dr. Alan Turing",
      performedByRole: "hod",
      action: "Investigation in Progress",
      remarks: "HOD initiated inquiry. Security footage requested and witnesses summoned.",
      status: "Investigation in Progress",
      createdAt: daysAgo(5),
    },
    {
      id: "h_6",
      complaintId: "ar_c_2",
      performedBy: "u_hod_cse",
      performedByName: "Dr. Alan Turing",
      performedByRole: "hod",
      action: "Action Taken",
      remarks: "Perpetrators identified and summoned. Disciplinary warning issued and parental notification sent.",
      status: "Action Taken",
      createdAt: daysAgo(3),
    },
    {
      id: "h_7",
      complaintId: "ar_c_2",
      performedBy: "u_hod_cse",
      performedByName: "Dr. Alan Turing",
      performedByRole: "hod",
      action: "Complaint Resolved",
      remarks: "Formal apologies submitted. Mandatory anti-ragging counseling arranged.",
      status: "Resolved",
      createdAt: daysAgo(2),
    },
    {
      id: "h_8",
      complaintId: "ar_c_3",
      performedBy: "u_student",
      performedByName: "Anonymous Student",
      performedByRole: "student",
      action: "Complaint Submitted",
      remarks: "Anonymous anti-ragging complaint submitted by student.",
      status: "Submitted",
      createdAt: daysAgo(1),
    },
  ]

  const lostFound: LostFoundItem[] = [
    {
      id: "lf_1",
      type: "lost",
      title: "Black backpack",
      description: "Lost near the cafeteria, contains a laptop charger.",
      location: "Cafeteria",
      category: "Bag",
      date: daysAgo(2).split("T")[0],
      imageUrl: null,
      status: "open",
      reportedById: "u_student",
      reportedByName: "Sam Student",
      contact: "student@campus.edu",
      claims: [],
      createdAt: daysAgo(2),
    },
    {
      id: "lf_2",
      type: "found",
      title: "Blue water bottle",
      description: "Found in Lecture Hall 101 after class.",
      location: "Lecture Hall 101",
      category: "Personal Item",
      date: daysAgo(4).split("T")[0],
      imageUrl: null,
      status: "open",
      reportedById: "u_faculty",
      reportedByName: "Dr. Farah Lee",
      contact: "faculty@campus.edu",
      claims: [],
      createdAt: daysAgo(4),
    },
  ]

  const announcements: Announcement[] = [
    {
      id: "a_1",
      title: "Zero Tolerance to Ragging Policy",
      body: "The Anti-Ragging Committee maintains zero tolerance. Ragging in any form is strictly prohibited and punishable under law.",
      authorName: "Ava Admin",
      createdAt: daysAgo(2),
    },
    {
      id: "a_2",
      title: "Campus complaint system active",
      body: "Submit and track all facility complaints directly via the online portal.",
      authorName: "Ava Admin",
      createdAt: daysAgo(6),
    },
  ]

  const notifications: Notification[] = [
    {
      id: "n_1",
      userId: "u_student",
      message: "Your complaint AR-2026-000002 has been resolved. View the complaint details for the action taken.",
      href: "/portal/anti-ragging",
      read: false,
      createdAt: daysAgo(2),
    },
    {
      id: "n_2",
      userId: "u_hod_cse",
      message: "A new anti-ragging complaint AR-2026-000001 has been assigned to you.",
      href: "/hod/complaints",
      read: false,
      createdAt: daysAgo(2),
    },
  ]

  return {
    users,
    resources,
    complaints,
    antiRaggingComplaints,
    antiRaggingHistory,
    lostFound,
    notifications,
    announcements,
    sessions: new Map(),
    seq: 1005,
    arSeq: 3,
  }
}

import fs from "fs"
import path from "path"
import os from "os"

function getDbPath(): string {
  if (process.env.DB_PATH) {
    return process.env.DB_PATH
  }
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), "campus_care_db.json")
  }
  const localPath = path.join(process.cwd(), ".data", "db.json")
  try {
    const dir = path.dirname(localPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.accessSync(dir, fs.constants.W_OK)
    return localPath
  } catch {
    return path.join(os.tmpdir(), "campus_care_db.json")
  }
}

function ensureDataDir(filePath: string) {
  try {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  } catch (err) {
    console.error("Data directory creation failed:", err)
  }
}

export function saveDb() {
  try {
    const dbPath = getDbPath()
    ensureDataDir(dbPath)
    const data = {
      users: db.users,
      resources: db.resources,
      complaints: db.complaints,
      antiRaggingComplaints: db.antiRaggingComplaints,
      antiRaggingHistory: db.antiRaggingHistory,
      lostFound: db.lostFound,
      notifications: db.notifications,
      announcements: db.announcements,
      sessions: Array.from(db.sessions.entries()),
      seq: db.seq,
      arSeq: db.arSeq,
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8")
  } catch (err) {
    console.error("Failed to save DB:", err)
  }
}

function normalizeStatus(st: string): AntiRaggingStatus {
  const map: Record<string, AntiRaggingStatus> = {
    pending: "Submitted",
    submitted: "Submitted",
    under_review: "Under Review",
    assigned: "Assigned to HOD",
    assigned_to_hod: "Assigned to HOD",
    in_progress: "Investigation in Progress",
    investigation_in_progress: "Investigation in Progress",
    action_taken: "Action Taken",
    resolved: "Resolved",
    rejected: "Rejected",
  }
  const key = (st || "").toLowerCase().replace(/\s+/g, "_")
  return map[key] || (st as AntiRaggingStatus) || "Submitted"
}

function loadDb(): DB {
  const dbPath = getDbPath()
  try {
    if (fs.existsSync(/*turbopackIgnore: true*/ dbPath)) {
      const raw = fs.readFileSync(/*turbopackIgnore: true*/ dbPath, "utf-8")
      const parsed = JSON.parse(raw)
      const initial = seed()

      // Normalize complaints
      const rawComplaints = parsed.complaints || []
      const isAr = (c: any) =>
        c.complaintId?.startsWith("AR-") ||
        c.id?.startsWith("ar_") ||
        [
          "verbal_abuse",
          "physical",
          "hostile_behavior",
          "cyber_ragging",
          "extortion",
          "sexual_harassment",
          "discrimination",
        ].includes(c.category)

      let arComplaints: AntiRaggingComplaint[] = parsed.antiRaggingComplaints || []
      let facilityComplaints: Complaint[] = []

      if (arComplaints.length === 0) {
        // Extract any AR complaints from parsed.complaints
        const extracted = rawComplaints.filter(isAr)
        if (extracted.length > 0) {
          arComplaints = extracted.map((c: any) => ({
            id: c.id,
            complaintId: c.complaintId || c.code || `AR-2026-00000${c.id}`,
            studentId: c.studentId || c.submittedById || "STU-001",
            studentName: c.studentName || c.submittedByName || "Student",
            studentEmail: c.studentEmail || "student@campus.edu",
            department: c.department || "General",
            year: c.year || "1st Year",
            section: c.section || "A",
            category: c.category || "verbal_abuse",
            incidentDate: c.incidentDate || new Date().toISOString().split("T")[0],
            incidentTime: c.incidentTime,
            location: c.location || c.incidentLocation || "Campus",
            description: c.description || "",
            peopleInvolved: c.peopleInvolved || c.personsInvolved || "Unknown",
            anonymous: Boolean(c.anonymous),
            evidence: c.evidence || "",
            evidenceAttachments: c.evidenceAttachments || [],
            status: normalizeStatus(c.status),
            verifiedBy: c.verifiedBy || c.adminAssignedBy || null,
            verifiedByName: c.verifiedByName || (c.adminAssignedBy ? "Ava Admin" : null),
            verifiedAt: c.verifiedAt || c.adminAssignedAt || null,
            assignedHod: c.assignedHod || c.assignedHodId || c.assignedToId || null,
            assignedHodName: c.assignedHodName || c.assignedToName || null,
            assignedDepartment: c.assignedDepartment || c.department || null,
            assignedAt: c.assignedAt || c.adminAssignedAt || null,
            investigationNotes: c.investigationNotes || c.hodRemarks || null,
            actionTaken: c.actionTaken || null,
            actionTakenAt: c.actionTakenAt || null,
            resolutionRemarks: c.resolutionRemarks || null,
            rejectionReason: c.rejectionReason || null,
            createdAt: c.createdAt || new Date().toISOString(),
            updatedAt: c.updatedAt || new Date().toISOString(),
            resolvedAt: c.resolvedAt || null,
          }))
        }
      } else {
        arComplaints = arComplaints.map((c: any) => ({
          ...c,
          status: normalizeStatus(c.status),
        }))
      }

      facilityComplaints = rawComplaints.filter((c: any) => !isAr(c))
      if (facilityComplaints.length === 0) {
        facilityComplaints = initial.complaints
      }

      if (arComplaints.length === 0) {
        arComplaints = initial.antiRaggingComplaints
      }

      let history: ComplaintAction[] = parsed.antiRaggingHistory || []
      if (history.length === 0 && parsed.complaintHistory) {
        history = parsed.complaintHistory.map((h: any) => ({
          id: h.id,
          complaintId: h.complaintId,
          performedBy: h.performedBy,
          performedByName: h.performedByName,
          performedByRole: h.performedByRole || "admin",
          action: h.action,
          remarks: h.remarks,
          status: normalizeStatus(h.newStatus || h.status),
          createdAt: h.createdAt,
        }))
      }
      if (history.length === 0) {
        history = initial.antiRaggingHistory
      }

      // Merge initial users to ensure HODs and admin exist
      const loadedUsers: User[] = parsed.users || []
      initial.users.forEach((iu) => {
        if (!loadedUsers.some((u) => u.id === iu.id || u.email.toLowerCase() === iu.email.toLowerCase())) {
          loadedUsers.push(iu)
        }
      })

      return {
        users: loadedUsers,
        resources: parsed.resources || initial.resources,
        complaints: facilityComplaints,
        antiRaggingComplaints: arComplaints,
        antiRaggingHistory: history,
        lostFound: parsed.lostFound || initial.lostFound,
        notifications: parsed.notifications || initial.notifications,
        announcements: parsed.announcements || initial.announcements,
        sessions: new Map(parsed.sessions || []),
        seq: parsed.seq || 1005,
        arSeq: parsed.arSeq || (arComplaints.length > 0 ? arComplaints.length : 3),
      }
    }
  } catch (err) {
    console.error("Failed to load DB, seeding new:", err)
  }
  const initial = seed()
  try {
    ensureDataDir(dbPath)
    const data = {
      users: initial.users,
      resources: initial.resources,
      complaints: initial.complaints,
      antiRaggingComplaints: initial.antiRaggingComplaints,
      antiRaggingHistory: initial.antiRaggingHistory,
      lostFound: initial.lostFound,
      notifications: initial.notifications,
      announcements: initial.announcements,
      sessions: Array.from(initial.sessions.entries()),
      seq: initial.seq,
      arSeq: initial.arSeq,
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8")
  } catch (err) {
    console.error("Failed to write initial DB:", err)
  }
  return initial
}

const g = globalThis as unknown as { __campus_care_db?: DB }
export const db: DB = g.__campus_care_db ?? (g.__campus_care_db = loadDb())

export function nextCode() {
  db.seq += 1
  saveDb()
  return `CMP-${db.seq}`
}

export function nextArCode(): string {
  db.arSeq += 1
  saveDb()
  const year = new Date().getFullYear()
  return `AR-${year}-${String(db.arSeq).padStart(6, "0")}`
}

export { uid }


