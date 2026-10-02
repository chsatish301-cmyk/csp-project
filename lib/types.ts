export type Role = "student" | "faculty" | "maintenance" | "admin" | "hod"

export type ComplaintStatus = "pending" | "assigned" | "in_progress" | "resolved" | "rejected"
export type Priority = "low" | "medium" | "high" | "urgent"

export type ComplaintCategory =
  | "electrical"
  | "plumbing"
  | "furniture"
  | "cleaning"
  | "network"
  | "civil"
  | "other"

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: Role
  department: string | null
  hostel: string | null
  studentId?: string | null
  employeeId?: string | null
  mobileNumber?: string | null
  year?: string | null
  section?: string | null
  createdAt: string
  updatedAt?: string
}

export type PublicUser = Omit<User, "password">

export interface Resource {
  id: string
  name: string
  type: string
  location: string
  createdAt: string
}

export interface Feedback {
  rating: number
  comment: string
  createdAt: string
}

export interface Complaint {
  id: string
  code: string
  title: string
  description: string
  category: ComplaintCategory
  priority: Priority
  location: string
  resourceId: string | null
  status: ComplaintStatus
  submittedById: string
  submittedByName: string
  assignedToId: string | null
  assignedToName: string | null
  feedback: Feedback | null
  createdAt: string
  updatedAt: string
}

export interface ClaimRequest {
  id: string
  itemId: string
  claimedById: string
  claimedByName: string
  claimedByContact: string
  proofDetails: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export interface LostFoundItem {
  id: string
  type: "lost" | "found"
  title: string
  description: string
  location: string
  category: string
  date: string
  imageUrl?: string | null
  status: "open" | "claimed" | "returned"
  reportedById: string
  reportedByName: string
  contact: string
  claims?: ClaimRequest[]
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  message: string
  href: string | null
  read: boolean
  createdAt: string
}

export interface Announcement {
  id: string
  title: string
  body: string
  authorName: string
  createdAt: string
}

export type AntiRaggingStatus =
  | "Submitted"
  | "Under Review"
  | "Assigned to HOD"
  | "Investigation in Progress"
  | "Action Taken"
  | "Resolved"
  | "Rejected"

export type AntiRaggingCategory =
  | "verbal_abuse"
  | "physical"
  | "hostile_behavior"
  | "cyber_ragging"
  | "extortion"
  | "sexual_harassment"
  | "discrimination"
  | "other"

export interface EvidenceAttachment {
  name: string
  url?: string
  type?: string
  size?: number
}

export interface AntiRaggingComplaint {
  id: string
  complaintId: string // e.g. AR-2026-000001
  studentId: string
  studentName: string
  studentEmail: string
  department: string
  year?: string
  section?: string
  category: AntiRaggingCategory
  incidentDate: string
  incidentTime?: string
  location: string
  description: string
  peopleInvolved: string
  anonymous: boolean
  evidence: string
  evidenceAttachments?: EvidenceAttachment[]
  status: AntiRaggingStatus
  verifiedBy?: string | null
  verifiedByName?: string | null
  verifiedAt?: string | null
  assignedHod?: string | null
  assignedHodName?: string | null
  assignedDepartment?: string | null
  assignedAt?: string | null
  investigationNotes?: string | null
  actionTaken?: string | null
  actionTakenAt?: string | null
  resolutionRemarks?: string | null
  rejectionReason?: string | null
  createdAt: string
  updatedAt: string
  resolvedAt?: string | null
}

export interface ComplaintAction {
  id: string
  complaintId: string
  performedBy: string
  performedByName: string
  performedByRole: Role
  action: string
  remarks: string
  status: AntiRaggingStatus
  createdAt: string
}

