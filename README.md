# Campus Care — Anti-Ragging & Campus Grievance Resolution System

Campus Care is a modern, responsive, role-based campus grievance and resource management platform built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS**. It includes a dedicated, secure **Anti-Ragging Module** with strict role-based access control (RBAC), end-to-end incident tracking, and audit trails.

---

## 1. Anti-Ragging Module Overview

The Anti-Ragging module provides a confidential, legal-standard reporting and resolution framework following UGC guidelines:

- **Student Protection**: Zero-tolerance policy, anonymous submission option, confidential evidence storage, and live status tracking with visual timeline progress.
- **Role Segregation**: Main Administrators verify, assign, monitor, and audit complaints. Department HODs/Sub-Admins conduct inquiries, record disciplinary/corrective actions, and resolve cases.
- **Auditability**: Every verification, assignment, note, status change, and disciplinary action is logged immutably in the complaint investigation history.
- **Real-time Notifications**: Triggered on submission, verification, assignment, inquiry updates, and final resolution.

---

## 2. Portals & Workflows

### Student Workflow
1. **Awareness & Helplines**: View 24/7 National Anti-Ragging Helpline (1800-180-5522), campus security, and proctor contacts.
2. **File Complaint**: Secure complaint form with category, incident date/time, location, people involved, detailed description, file/photo attachments, and anonymous mode.
3. **Track Live Progress**: "My Complaints" dashboard displays interactive status badges and an 6-stage timeline:
   $$\text{Submitted} \longrightarrow \text{Under Review} \longrightarrow \text{Assigned to HOD} \longrightarrow \text{Investigation in Progress} \longrightarrow \text{Action Taken} \longrightarrow \text{Resolved}$$
4. **Student Security**: Students cannot alter statuses or access complaints filed by others.

### Admin Workflow
1. **Oversight Dashboard**: Key metric cards (Total Complaints, New Complaints, Under Review, Assigned, In Progress, Resolved).
2. **Search & Filter**: Filter by department, status, incident date, or search keywords.
3. **Verification**: Verify preliminary details to transition complaint to `Under Review`.
4. **HOD Assignment**: Route the case to the appropriate department HOD/Sub-Admin (or reassign when necessary) with custom instructions.
5. **Monitoring & Audit**: Monitor inquiry notes, review evidence, inspect actions taken, and audit complete timeline logs.

### HOD / Sub-Admin Workflow
1. **Department Isolation**: HODs only see complaints assigned to their department/account.
2. **Active Inquiry**: Change status to `Investigation in Progress`, summon involved parties, review CCTV/witness statements.
3. **Record Action Taken**: Log official disciplinary actions (e.g., warning letters, parental notifications, mandatory counseling, suspension).
4. **Resolution**: Mark the complaint as `Resolved` with resolution remarks. Student is notified immediately.

---

## 3. Role-Based Access Control (RBAC)

| Role | Submit Complaint | View All Complaints | Verify & Assign HOD | Investigate & Take Action | Change Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Student** | ✅ | ❌ (Own only) | ❌ | ❌ | ❌ |
| **Admin** | ❌ | ✅ (Campus-wide) | ✅ | ❌ (Audits/Monitors) | ✅ |
| **HOD / Sub-Admin** | ❌ | ❌ (Assigned only) | ❌ | ✅ | ✅ |

Both frontend routes (`/portal`, `/admin`, `/hod`) and backend APIs (`/api/anti-ragging/*`) strictly enforce these authorization rules.

---

## 4. Database Schema & Persistence

Data is persisted in `csp-project/.data/db.json` using the built-in storage engine (`csp-project/lib/store.ts`):

### Users
- `id` (string)
- `name` (string)
- `email` (string, unique)
- `password` (hashed `salt:hash` via scrypt)
- `role` (`"student"` | `"admin"` | `"hod"` | `"faculty"` | `"maintenance"`)
- `studentId` / `employeeId` (string)
- `department` (string)
- `year` / `section` (string)
- `createdAt` / `updatedAt` (ISO timestamp)

### AntiRaggingComplaints
- `id` (e.g., `ar_c_1`)
- `complaintId` (e.g., `AR-2026-000001`)
- `studentId`, `studentName`, `studentEmail`, `department`, `year`, `section`
- `category` (`verbal_abuse`, `physical`, `hostile_behavior`, `cyber_ragging`, `extortion`, `sexual_harassment`, `discrimination`, `other`)
- `incidentDate`, `incidentTime`, `location`, `description`, `peopleInvolved`
- `anonymous` (boolean)
- `evidence`, `evidenceAttachments`
- `status` (`Submitted`, `Under Review`, `Assigned to HOD`, `Investigation in Progress`, `Action Taken`, `Resolved`, `Rejected`)
- `verifiedBy`, `verifiedByName`, `verifiedAt`
- `assignedHod`, `assignedHodName`, `assignedDepartment`, `assignedAt`
- `investigationNotes`, `actionTaken`, `actionTakenAt`, `resolutionRemarks`, `resolvedAt`
- `createdAt`, `updatedAt`

### ComplaintActions / InvestigationHistory
- `id` (string)
- `complaintId` (string)
- `performedBy` (user ID)
- `performedByName` (string)
- `performedByRole` (`"student"` | `"admin"` | `"hod"`)
- `action` (string)
- `remarks` (string)
- `status` (string)
- `createdAt` (ISO timestamp)

---

## 5. API Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/anti-ragging/complaints` | Student | Submit an anti-ragging complaint |
| `GET` | `/api/anti-ragging/complaints` | Admin / HOD | Fetch complaints (filtered by role and query params) |
| `GET` | `/api/anti-ragging/complaints/:id` | Student (own) / HOD (assigned) / Admin | Fetch complaint details and history |
| `PUT` | `/api/anti-ragging/complaints/:id/verify` | Admin | Verify complaint (sets status to `Under Review`) |
| `PUT` | `/api/anti-ragging/complaints/:id/assign` | Admin | Assign or reassign complaint to an HOD |
| `PUT` | `/api/anti-ragging/complaints/:id/status` | HOD / Admin | Update investigation status (`Investigation in Progress`, `Action Taken`, `Resolved`, `Rejected`) |
| `POST` | `/api/anti-ragging/complaints/:id/actions` | HOD / Admin | Record inquiry notes, remarks, or disciplinary actions taken |
| `GET` | `/api/anti-ragging/complaints/:id/history` | Authorized | Fetch full audit trail and investigation logs |
| `GET` | `/api/anti-ragging/my-complaints` | Student | Fetch logged-in student's complaints |

---

## 6. Demo Accounts & Credentials

All demo accounts use the default password: **`vivek@2006`**

| Portal | Email | Role | Department | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Admin Portal** | `admin@campus.edu` | `admin` | Administration | Full oversight, verification, HOD assignment |
| **HOD Portal** | `hod.cse@campus.edu` | `hod` | CSE | Dr. Alan Turing — CSE Department Head |
| **HOD Portal** | `hod.ece@campus.edu` | `hod` | ECE | Dr. Claude Shannon — ECE Department Head |
| **HOD Portal** | `hod.mech@campus.edu` | `hod` | Mechanical | Dr. Nikola Tesla — Mech Department Head |
| **Student Portal**| `student@campus.edu` | `student` | CSE | Sam Student — Submit & track complaints |
| **Maintenance** | `maintenance@campus.edu` | `maintenance`| Facilities | Facility & maintenance worker |

---

## 7. How to Run the Project

### Prerequisites
- Node.js 18+ (tested on Node.js 22/24)
- npm or pnpm

### Installation
```bash
cd csp-project
npm install
```

### Environment Variables (Optional)
Create a `.env.local` if custom signing secrets are required:
```env
SESSION_SECRET=your-custom-production-secret-key
COOKIE_SECURE=false
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 8. Running Automated Tests

An automated end-to-end integration and security test suite is included in `csp-project/tests/test-flow.mjs`.

To run the test:
1. Start the server:
   ```bash
   cd csp-project
   npm run start
   ```
2. In a separate terminal, execute:
   ```bash
   node tests/test-flow.mjs
   ```
The test script automatically validates:
- Student login & complaint creation (`AR-...`).
- Admin login, complaint verification (`Under Review`), and HOD assignment (`Assigned to HOD`).
- HOD login, inquiry recording (`Action Taken`), and resolution (`Resolved`).
- Student audit trail verification.
- Security checks ensuring students and unrelated HODs cannot execute restricted actions or access foreign complaints.
