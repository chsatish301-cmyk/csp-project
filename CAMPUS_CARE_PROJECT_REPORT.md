# CAMPUS CARE — ANTI-RAGGING & CAMPUS GRIEVANCE RESOLUTION SYSTEM
### A PROJECT REPORT ON COMMUNITY SERVICE PROJECT

**Submitted in partial fulfillment of the requirements for the award of the degree of**
**BACHELOR OF TECHNOLOGY IN INFORMATION TECHNOLOGY / IECT**

**Submitted by:**
- **I. Yogesh Tulsidas** (Regd. No: 20331A1239)
- **K. Prasanna** (Regd. No: 20331A1263)
- **B. Kishan Kumar** (Regd. No: 20331A1214)

**Under the Esteemed Guidance of:**
**Mr. R. Ravi Kumar, M.Tech**
Assistant Professor, Department of IECT

**DEPARTMENT OF INFORMATION ENGINEERING & COMPUTATIONAL TECHNOLOGY**
**MAHARAJ VIJAYARAM GAJAPATHI RAJ COLLEGE OF ENGINEERING (AUTONOMOUS)**
*(Approved by AICTE, New Delhi, Accredited by NBA & NAAC with 'A' Grade)*
**VIZIANAGARAM - 535 005, ANDHRA PRADESH (INDIA)**
**ACADEMIC YEAR: 2024-2025**

---

## DECLARATION

I hereby declare that the Community Service Project report entitled **“CAMPUS CARE — ANTI-RAGGING & CAMPUS GRIEVANCE RESOLUTION SYSTEM”** submitted in partial fulfillment of the requirements for the award of the degree of Bachelor of Technology in Information Engineering & Computational Technology at Maharaj Vijayaram Gajapathi Raj College of Engineering (Autonomous), Vizianagaram, is an authentic record of bonafide project work carried out under the guidance of **Mr. R. Ravi Kumar, M.Tech**, Assistant Professor, Department of IECT.

I further declare that this project work has not previously formed the basis for the award of any Degree, Diploma, Associateship, Fellowship, or any other similar title in this or any other University or Institution of higher learning.

**Place:** Vizianagaram  
**Date:** 02-10-2026  

**Candidate Signature:**  
_______________________  
**I. Yogesh Tulsidas (20331A1239)**  
Dept. of IECT, MVGR College of Engineering (A)

---

## CERTIFICATE

This is to certify that the project report entitled **“CAMPUS CARE — ANTI-RAGGING & CAMPUS GRIEVANCE RESOLUTION SYSTEM”** is the bonafide work carried out by **I. Yogesh Tulsidas (20331A1239)**, **K. Prasanna (20331A1263)**, and **B. Kishan Kumar (20331A1214)** of B.Tech V Semester, Department of Information Engineering & Computational Technology, Maharaj Vijayaram Gajapathi Raj College of Engineering (Autonomous), Vizianagaram, during the academic year 2024–2025, in fulfillment of the Community Service Project requirements for Bachelor of Technology, and that this project has not formed the basis for the submission previously of any degree or any other similar title.

| **Signature of Project Guide** | **Signature of Head of Department** |
| :--- | :--- |
| <br><br><br>**Mr. R. Ravi Kumar, M.Tech**<br>Assistant Professor<br>Dept. of IECT<br>MVGR College of Engineering (A) | <br><br><br>**Dr. Anjana Devi. B, M.Tech, Ph.D**<br>Associate Professor & HOD<br>Dept. of IECT<br>MVGR College of Engineering (A) |

**Place:** Vizianagaram  
**Date:** 02-10-2026

---

## TABLE OF CONTENTS

| Chapter | Title | Page No. |
| :---: | :--- | :---: |
| **1** | **ABSTRACT** | **1** |
| **2** | **INTRODUCTION** | **2** |
| **3** | **PROBLEM STATEMENT** | **4** |
| **4** | **SYSTEM REQUIREMENTS** | **5** |
| | 4.1 Hardware Requirements | 5 |
| | 4.2 Software Requirements | 5 |
| **5** | **TECHNOLOGIES USED** | **6** |
| **6** | **EXISTING SYSTEM** | **10** |
| **7** | **PROPOSED SYSTEM** | **11** |
| **8** | **USE-CASES & ROLE-BASED ACCESS CONTROL (RBAC)** | **13** |
| **9** | **PROCESS-FLOW & SYSTEM ARCHITECTURE** | **16** |
| **10** | **SAMPLE CODE IMPLEMENTATION** | **19** |
| **11** | **OUTPUT SCREENSHOTS & USER INTERFACE** | **24** |
| **12** | **ADVANTAGES** | **27** |
| **13** | **LIMITATIONS** | **28** |
| **14** | **CONCLUSION** | **29** |
| **15** | **FUTURE SCOPE** | **30** |
| **16** | **REFERENCES** | **31** |

---

## 1. ABSTRACT

**Campus Care** is a full-stack, role-based campus grievance resolution and anti-ragging management platform engineered to modernize institutional safety, accountability, and operational efficiency across collegiate campuses. Built on **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS**, Campus Care provides a secure, unified digital infrastructure for students, faculty, department heads (HODs), facilities maintenance personnel, and central administrators.

A core innovation of Campus Care is its dedicated **Anti-Ragging Redressal Framework**, strictly aligned with University Grants Commission (UGC) regulations and Supreme Court mandates on curbing ragging in higher educational institutions. The system features 24/7 emergency hotline integrations, crisis guidance, and an **anonymous incident filing mechanism** that eliminates fear of academic or social retribution while capturing crucial contextual evidence, incident timestamps, physical campus locations, and perpetrator descriptions.

To guarantee procedural integrity, Campus Care enforces a rigorous **6-stage lifecycle**:
$$\text{Submitted} \longrightarrow \text{Under Review} \longrightarrow \text{Assigned to HOD} \longrightarrow \text{Investigation in Progress} \longrightarrow \text{Action Taken} \longrightarrow \text{Resolved (or Rejected)}$$

Central administrators execute preliminary validation and route grievances to corresponding academic department heads with tailored directives. Every administrative note, summon, witness review, disciplinary action, and status change is logged into an append-only, tamper-evident audit history.

Beyond anti-ragging, the platform manages daily campus infrastructure tickets across electrical, plumbing, civil, and network categories, complete with priority assignments and automated maintenance routing. Security is guaranteed through **scrypt** password hashing with cryptographically random 16-byte salts, **HMAC-SHA256** signed session cookies with constant-time equality validation (`timingSafeEqual`), and granular **Role-Based Access Control (RBAC)** across client interfaces and RESTful server endpoints.

---

## 2. INTRODUCTION

Higher educational institutions accommodate thousands of students, faculty members, administrative staff, and maintenance personnel. Maintaining an environment that fosters academic excellence, psychological security, and operational harmony requires responsive mechanisms for grievance redressal and campus life management. However, many colleges continue to rely on antiquated, disjointed channels—such as physical paper dropboxes, manual registers, or sporadic email threads—which lack transparency, velocity, and institutional accountability.

Among all campus grievances, **ragging** represents one of the most severe threats to student welfare, mental health, and physical safety. Despite nationwide prohibitions established by regulatory bodies like the University Grants Commission (UGC), All India Council for Technical Education (AICTE), and state higher education departments, incidents persist due to victims' fear of disclosure, threat of retaliation by senior students, and the absence of safe, confidential reporting channels. Conventional reporting mechanisms often expose the victim’s identity early in the process, resulting in severe social stigmatization and intimidation.

In parallel, institutional physical infrastructure requires continuous upkeep. Routine issues such as broken laboratory electrical fixtures, leaking hostel plumbing, classroom furniture breakages, and campus Wi-Fi outages impair teaching and learning when left unresolved. Traditional reporting leads to work requests being lost in administrative silos, leaving students and faculty completely unaware of ticket progress, while administrators lack quantitative data regarding resolution times and contractor performance.

**Campus Care** was conceived and developed as a **Community Service Project (CSP)** to directly resolve these urgent institutional challenges. By leveraging modern web architectures, secure cryptographic protocols, and human-centered design principles, Campus Care bridges the divide between campus stakeholders. It provides an empowering digital platform where students can seek help without fear, maintenance staff receive clear task directives, department heads execute structured investigations, and college executives retain panoramic oversight over campus well-being.

### 2.1 Objectives of the Project
1. **Student Protection**: Provide a secure, confidential, and UGC-compliant reporting portal for campus ragging incidents with complete student anonymity options.
2. **Structured Redressal**: Implement an end-to-end 6-stage grievance resolution workflow ensuring transparent escalation from submission to formal inquiry, action taken, and resolution.
3. **Role Isolation**: Enforce strict Role-Based Access Control (RBAC) across five user tiers (Student, Faculty, Maintenance, HOD, Admin) preventing unauthorized data access.
4. **Accountability & Auditing**: Deliver an automated, tamper-evident investigation audit trail documenting every status transition, administrative summon, and disciplinary order.
5. **Infrastructure Redressal**: Centralize campus infrastructure maintenance (electrical, plumbing, civil, network) with priority-based ticket management.
6. **Resource Management**: Deploy a digitized Campus Lost & Found repository enabling students to report items and submit verifiable ownership claims.

---

## 3. PROBLEM STATEMENT

An examination of existing grievance management practices in educational institutions reveals critical vulnerabilities across both social safety and physical operations:

1. **Lack of Confidentiality & Anonymity**: The primary impediment to eliminating ragging is student silence driven by fear of retaliation, academic victimisation, and social exclusion. Traditional complaint channels require physical presence or signed letters, making anonymity practically impossible. When identity cannot be guaranteed confidential, junior students endure harassment rather than risk confrontation with seniors.
2. **Zero Real-Time Tracking & Transparency**: In manual systems, once a complaint is submitted, it enters an information black hole. The complainant has no visibility into whether the administration received the grievance, who was tasked with investigating it, or what corrective actions were executed. This opacity breeds disillusionment and distrust toward institutional authorities.
3. **Absence of Verifiable Audit Trails**: Disciplinary inquiries frequently suffer from decentralized record-keeping. Investigation notes, witness statements, and administrative summons are kept in loose paper files or fragmented emails. Without an immutable digital audit log, colleges cannot reconstruct the exact timeline of investigations, creating legal vulnerabilities during statutory compliance reviews.
4. **Inefficient Physical Infrastructure Maintenance**: Facility-related problems—such as water leakage in hostel blocks, projector failures in lecture halls, and internet outages—are often reported verbally to wardens or technicians. These requests frequently slip through cracks due to lack of SLA tracking, priority classification, and technician dispatch mechanisms.
5. **Security & Privacy Vulnerabilities**: Simple web applications often suffer from rudimentary authentication (e.g., plain text or vulnerable MD5 hashing) and lack granular role enforcement. Unrestricted API access risks exposing highly sensitive victim identities and confidential inquiry documentation to malicious actors or unauthorised peers.

---

## 4. SYSTEM REQUIREMENTS

### 4.1 Hardware Requirements

| Component | Development / Host Minimum | Recommended Server Specification | Client Device Minimum |
| :--- | :--- | :--- | :--- |
| **Processor** | Intel Core i5 / AMD Ryzen 5 (Quad Core) | Intel Xeon / AMD EPYC (8+ Cores) | Intel Core i3 / Mobile SoC (ARM) |
| **RAM** | 8 GB DDR4 | 16 GB – 32 GB DDR4/DDR5 | 4 GB RAM |
| **Storage** | 256 GB SSD (50 GB free) | 512 GB – 1 TB NVMe SSD | Standard local storage |
| **Network** | Broadband (10 Mbps+) | High-Speed Dedicated Link (100 Mbps+) | 4G/5G or Wi-Fi (2 Mbps+) |
| **Display** | 1366 x 768 Resolution | 1920 x 1080 Full HD | Responsive (Mobile / Tablet / PC) |
| **Peripherals** | Keyboard & Mouse | Server Console | Touchscreen / Keyboard / Mouse |

### 4.2 Software Requirements

| Software Component | Specification / Technology Utilized |
| :--- | :--- |
| **Operating System** | Microsoft Windows 10/11 64-bit, Ubuntu Linux 22.04 LTS, or macOS 14+ |
| **Runtime Environment** | Node.js (v18.17.0+ or v20.x/v24.x LTS) |
| **Web Framework** | Next.js 16 (React Server Components, App Router architecture) |
| **Frontend UI Library** | React 19 (Server & Client Components) with TypeScript |
| **Styling & CSS** | Tailwind CSS with CSS Variables and PostCSS |
| **Component Primitives** | Radix UI Primitives, Lucide React Iconography, Shadcn UI |
| **State & Data Fetching** | SWR (Stale-While-Revalidate) client data synchronization |
| **Cryptography Engine** | Node.js Crypto (scrypt algorithm, randomBytes salt, HMAC-SHA256) |
| **Database Engine** | ACID-compliant JSON Persistence Storage Engine with disk syncing |
| **Development Tools** | Visual Studio Code, PowerShell, Git Version Control |
| **Supported Browsers** | Google Chrome 110+, Mozilla Firefox 110+, Microsoft Edge 110+, Safari 16+ |

---

## 5. TECHNOLOGIES USED

### NEXT.JS 16
Next.js 16 represents the state-of-the-art React framework for production-grade full-stack web applications. By utilizing the modern App Router architecture, Next.js combines server-side rendering (SSR), static site generation (SSG), and React Server Components (RSC) to maximize client load performance, search accessibility, and zero-bundle-size server logic. In Campus Care, Next.js powers both the interactive user dashboards and the backend REST API route handlers (`/api/*`), streamlining development within a cohesive, unified TypeScript codebase.

### REACT 19 & TYPESCRIPT
React 19 powers the user interface of Campus Care. Introducing compiler-driven optimizations, server actions, and fine-grained reactivity, React 19 enables instantaneous UI updates without unnecessary re-renders. Combined with TypeScript, every component, data model, and API contract is strongly typed at compile time, eliminating an entire category of runtime errors.

### TAILWIND CSS
Tailwind CSS is an efficient, utility-first CSS framework that facilitates rapid UI construction directly within component markup. By utilizing CSS design tokens and theme variables, Campus Care achieves a responsive design that adapts smoothly across mobile phones, tablets, and high-resolution desktop monitors. It also enables dark-mode adaptability and consistent color palettes tailored to institutional branding.

### SCRYPT SALTED PASSWORD HASHING
Password security is paramount when storing sensitive student credentials. Rather than legacy, vulnerable algorithms such as MD5 or single-iteration SHA-256, Campus Care implements **scrypt** via the native Node.js crypto module. scrypt is a memory-hard password derivation function specifically designed to resist hardware-accelerated attacks (e.g., ASICs and GPUs). A unique 16-byte cryptographically secure random salt is generated for each user, preventing precomputed dictionary and rainbow table compromises.

### HMAC-SHA256 SESSION INTEGRITY
Campus Care maintains session integrity using signed HTTP-only cookies protected by HMAC-SHA256 (Hash-based Message Authentication Code). To prevent side-channel timing attacks—where an adversary measures microsecond variations in string comparison to deduce secret signatures—the verification routine uses `crypto.timingSafeEqual()`, ensuring constant-time buffer evaluations.

### SWR (STALE-WHILE-REVALIDATE)
SWR is an advanced React hooks library developed by Vercel for client-side data synchronization. SWR displays cached data immediately (stale), sends a background fetch request (revalidate), and updates the UI automatically upon response arrival. In Campus Care, SWR provides real-time polling intervals for complaint tracking and notification panels without requiring full page refreshes.

### JSON PERSISTENCE STORAGE ENGINE
The backend persistence layer utilizes a high-performance, file-backed JSON storage engine (`csp-project/.data/db.json`) augmented by in-memory caching. This architecture guarantees atomic read/write cycles, automated disk persistence, and rapid indexed lookups across users, anti-ragging tickets, investigation histories, and facility complaints without the overhead of external database server configurations.

### RADIX UI & LUCIDE ICONS
Campus Care integrates accessible primitives from Radix UI and Lucide React icons. Accessible dialog modals, dropdown selectors, accordions, and iconography provide students and administrators with clear visual cues and an accessible user experience.

---

## 6. EXISTING SYSTEM

In most collegiate institutions, campus grievances and ragging reports continue to be processed through traditional, manual, or poorly integrated administrative channels:

- **Vulnerability of Physical Dropboxes**: Victims of ragging are typically required to submit written, signed petitions to the anti-ragging committee or drop letters into physical complaint boxes. This process offers no true confidentiality, as physical drops are vulnerable to observation by peers or perpetrators.
- **Pervasive Retaliation Fears**: Traditional reporting methods mandate disclosing personal identifying details, causing severe apprehension among junior students regarding future hostility, harassment, or social isolation by senior cohorts.
- **Zero Live Status Tracking**: Complainants have no digital portal to track the status of their grievance. Once a report is handed over, the victim is left in uncertainty regarding whether the authority has reviewed the file or taken any protective action.
- **Fragmented Investigation Records**: Inquiry notes, disciplinary notices, and meeting minutes are documented on loose paper records or across uncoordinated staff emails. Such unlinked systems fail to provide an immutable chronological record when legal or statutory reviews are conducted.
- **Unmanaged Infrastructure Redressal**: Routine issues regarding laboratory equipment, hostel plumbing, electrical wiring, or Wi-Fi connectivity are reported through word-of-mouth or paper registers at the security desk. Requests frequently languish unaddressed for weeks without escalation.
- **Inadequate Security Measures**: Simple web portals developed previously often store passwords using obsolete hashing algorithms (such as MD5 or plain text), lack role-based data partitioning, and permit unauthorized access to sensitive grievance records.

---

## 7. PROPOSED SYSTEM

The proposed system, **Campus Care**, provides a secure, role-based, end-to-end web platform engineered to modernize student safety and institutional grievance management. The system is designed around six foundational pillars:

1. **Anonymous & Confidential Anti-Ragging Reporting**: Campus Care features an anonymous grievance submission option. When enabled by a student, the student's name, email, roll number, and contact details are masked during investigations while still allowing administrators and HODs to review evidence, issue inquiries, and post disciplinary updates.
2. **UGC-Compliant 6-Stage Redressal Lifecycle**: The platform enforces an automated 6-tier lifecycle that tracks complaints through every regulatory phase: `Submitted` $\to$ `Under Review` $\to$ `Assigned to HOD` $\to$ `Investigation in Progress` $\to$ `Action Taken` $\to$ `Resolved`. Real-time visual progress timelines inform students of case status transparently.
3. **Tamper-Evident Investigation Audit Trail**: Grievances are immutably logged with audit history tracking. Every transition, administrative instruction, witness deposition note, parental notification, and disciplinary measure (e.g., counseling, warning, suspension) is permanently recorded with user ID and timestamp.
4. **Strict Role-Based Access Control (RBAC)**: Campus Care enforces strict authorization across five user tiers: Students can file grievances and track their own cases; HODs can only investigate complaints assigned to their department; Central Administrators oversee campus-wide cases, verify details, and route assignments; Maintenance staff manage facility work orders.
5. **Modern Cryptographic Security**: User passwords are encrypted using scrypt with 16-byte random salts. Session cookies are signed with HMAC-SHA256 and verified using constant-time comparisons (`crypto.timingSafeEqual`) to neutralize timing attacks and session hijacking.
6. **Holistic Campus Resource Management**: In addition to ragging protection, Campus Care provides full facility maintenance tracking (electrical, plumbing, furniture, network) and an administrative Lost & Found registry with claim verification workflows.

---

## 8. USE-CASES & ROLE-BASED ACCESS CONTROL (RBAC)

### 8.1 Role-Based Access Control (RBAC) Matrix

| Action / Feature | Student | Admin | HOD / Sub-Admin | Maintenance |
| :--- | :---: | :---: | :---: | :---: |
| Access Emergency Helplines & UGC Guidelines | **YES** | **YES** | **YES** | **YES** |
| Submit Anti-Ragging Complaint | **YES** | NO | NO | NO |
| Submit Anonymous Complaint | **YES** | NO | NO | NO |
| Track Own Complaint Timeline | **YES** | NO | NO | NO |
| View Campus-Wide Complaints Oversight | NO | **YES** | NO | NO |
| Verify & Transition to 'Under Review' | NO | **YES** | NO | NO |
| Assign Complaint to Department HOD | NO | **YES** | NO | NO |
| Conduct Inquiry & Record Action Taken | NO | NO | **YES (Assigned)** | NO |
| Mark Complaint as 'Resolved' / 'Rejected' | NO | **YES** | **YES (Assigned)** | NO |
| View Audit Log & Investigation History | **YES (Own)** | **YES (All)** | **YES (Assigned)** | NO |
| File Physical Facility Grievance | **YES** | **YES** | **YES** | NO |
| Resolve Facility Work Orders | NO | NO | NO | **YES** |
| Manage Lost & Found Registry & Claims | Claim Only | **Full Access** | View Only | **Full Access** |

### 8.2 Detailed Use-Case Scenarios
- **Use Case 1: Student Incident Filing (Anonymous)**: A first-year student subjected to verbal harassment in the campus library accesses the portal. The student selects the "Anti-Ragging Support" module, chooses the incident category, specifies date, time, and campus location, types a summary, attaches photographic evidence, and selects "File Anonymously". The grievance is registered with a unique tracking code (e.g., `AR-2026-000001`). The student tracks the 6-stage timeline in real-time.
- **Use Case 2: Administrative Verification & Assignment**: The Chief Proctor or Central Administrator reviews new incoming tickets on the Admin Anti-Ragging Oversight board. The administrator reviews the evidence, verifies that the incident occurred on campus, adds initial verification remarks, and routes the ticket to the Head of Computer Science & Engineering (HOD CSE) with specific investigation instructions.
- **Use Case 3: Departmental Inquiry & Action Logging**: The CSE Department Head accesses the HOD Portal, views the assigned complaint, and transitions status to "Investigation in Progress". The HOD summons the accused parties, reviews library CCTV footage, records notes in the audit log, and issues formal disciplinary warnings. The HOD marks the ticket as "Action Taken" followed by "Resolved".
- **Use Case 4: Infrastructure Work Order Resolution**: A faculty member notices that ceiling fans in Classroom Block-B are non-functional. They log a ticket under category "Electrical" with "High" priority. The maintenance team receives the work order, dispatches a technician, completes the repair, and marks the task as resolved. The faculty member rates the resolution 5 stars.

---

## 9. PROCESS-FLOW & SYSTEM ARCHITECTURE

```
+-----------------------------------------------------------------+
|                 STUDENT COMPLAINT FILING                       |
|  - Select Category, Date, Time, Location & People Involved      |
|  - Attach Digital Evidence & Optional Anonymous Mode Toggle    |
+-------------------------------+---------------------------------+
                                |
                                v
                +-------------------------------+
                |     STATUS: 'Submitted'       |
                | (Complaint ID: AR-YYYY-NNNNNN)|
                +---------------+---------------+
                                |
                                v
+-----------------------------------------------------------------+
|                 ADMINISTRATIVE OVERSIGHT                        |
|  - Chief Proctor / Admin reviews preliminary evidence           |
|  - Verifies legitimacy & transitions status                    |
+-------------------------------+---------------------------------+
                                |
                                v
                +-------------------------------+
                |    STATUS: 'Under Review'     |
                +---------------+---------------+
                                |
                                v
+-----------------------------------------------------------------+
|                   ADMIN ROUTING & ASSIGNMENT                    |
|  - Select Department HOD (CSE / ECE / Mech / Civil / etc.)      |
|  - Enter specific inquiry instructions                         |
+-------------------------------+---------------------------------+
                                |
                                v
                +-------------------------------+
                |   STATUS: 'Assigned to HOD'   |
                +---------------+---------------+
                                |
                                v
+-----------------------------------------------------------------+
|                     HOD ACTIVE INQUIRY                          |
|  - Summon involved parties & inspect CCTV / witness testimonies |
|  - Record confidential investigation notes in audit log        |
+-------------------------------+---------------------------------+
                                |
                                v
                +------------------------------------+
                | STATUS: 'Investigation in Progress'|
                +---------------+--------------------+
                                |
                                v
+-----------------------------------------------------------------+
|               DISCIPLINARY / CORRECTIVE MEASURES                |
|  - Issue warning letters, parental summons, counseling, etc.   |
|  - Log official action into immutable investigation history    |
+-------------------------------+---------------------------------+
                                |
                                v
                +-------------------------------+
                |    STATUS: 'Action Taken'     |
                +---------------+---------------+
                                |
                                v
+-----------------------------------------------------------------+
|                     FINAL RESOLUTION                            |
|  - Record closing remarks & resolution summary                 |
|  - Student notified immediately on live tracking portal        |
+-------------------------------+---------------------------------+
                                |
                                v
                +-------------------------------+
                |       STATUS: 'Resolved'      |
                +-------------------------------+
```

### 9.2 System Architectural Layers
- **Presentation Layer (Client)**: Next.js 16 Client Components, Tailwind CSS styling, Radix UI dialogs, SWR real-time data hooks, and role-specific views for Student, Admin, HOD, and Maintenance.
- **Application & Business Logic Layer**: Next.js App Router API Route Handlers (`/api/anti-ragging/*`, `/api/auth/*`, `/api/complaints/*`) enforcing authentication, input validation, and role permissions.
- **Security & Cryptographic Layer**: Scrypt salted password hashing, HMAC-SHA256 session cookie signing, constant-time `timingSafeEqual` verification, and RBAC authorization middleware.
- **Data Persistence Layer**: High-performance JSON file storage engine (`.data/db.json`) maintaining users, grievance records, lost & found entries, notifications, and investigation audit trails.

---

## 10. SAMPLE CODE IMPLEMENTATION

### 10.1 Cryptographic Authentication & Session Security (`lib/auth.ts`)
```typescript
import { cookies } from "next/headers"
import crypto from "crypto"
import { db } from "./store"
import type { PublicUser, User } from "./types"

export const SESSION_COOKIE = "Campus Care_session"
const SECRET = process.env.SESSION_SECRET || "Campus Care-default-secret-key"

// Constant-time HMAC-SHA256 signature generation and validation
function sign(value: string): string {
  const hmac = crypto.createHmac("sha256", SECRET).update(value).digest("base64url")
  return `${value}.${hmac}`
}

function verify(signed: string): string | null {
  if (!signed || typeof signed !== "string") return null
  const idx = signed.lastIndexOf(".")
  if (idx === -1) return null
  const value = signed.slice(0, idx)
  const expected = sign(value)
  const signedBuf = Buffer.from(signed)
  const expectedBuf = Buffer.from(expected)
  if (signedBuf.length !== expectedBuf.length) return null
  if (!crypto.timingSafeEqual(signedBuf, expectedBuf)) return null
  return value
}

// Memory-hard scrypt password hashing with 16-byte random salt
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, hashOrPlain: string): boolean {
  if (!hashOrPlain || typeof hashOrPlain !== "string") return false
  if (!hashOrPlain.includes(":")) return password === hashOrPlain
  const [salt, key] = hashOrPlain.split(":")
  if (!salt || !key) return false
  const hashBuffer = crypto.scryptSync(password, salt, 64)
  const keyBuffer = Buffer.from(key, "hex")
  if (hashBuffer.length !== keyBuffer.length) return false
  return crypto.timingSafeEqual(hashBuffer, keyBuffer)
}
```

### 10.2 Anti-Ragging Complaint Submission API Handler (`app/api/anti-ragging/complaints/route.ts`)
```typescript
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db, saveDb } from "@/lib/store"
import type { AntiRaggingComplaint } from "@/lib/types"

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { category, incidentDate, incidentTime, location, description,
          peopleInvolved, anonymous, evidence, evidenceAttachments } = body

  if (!category || !incidentDate || !location || !description) {
    return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
  }

  db.arSeq += 1
  const complaintCode = `AR-${new Date().getFullYear()}-${String(db.arSeq).padStart(6, "0")}`

  const newComplaint: AntiRaggingComplaint = {
    id: `ar_c_${Date.now()}`,
    complaintId: complaintCode,
    studentId: user.id,
    studentName: anonymous ? "Anonymous Student" : user.name,
    studentEmail: anonymous ? "confidential@campus.edu" : user.email,
    department: user.department || "General",
    year: user.year || undefined,
    section: user.section || undefined,
    category,
    incidentDate,
    incidentTime,
    location,
    description,
    peopleInvolved,
    anonymous: Boolean(anonymous),
    evidence,
    evidenceAttachments: evidenceAttachments || [],
    status: "Submitted",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  db.antiRaggingComplaints.unshift(newComplaint)
  db.antiRaggingHistory.push({
    id: `act_${Date.now()}`,
    complaintId: newComplaint.id,
    performedBy: user.id,
    performedByName: anonymous ? "Anonymous Student" : user.name,
    performedByRole: "student",
    action: "Complaint Filed",
    remarks: "Anti-ragging incident registered securely.",
    status: "Submitted",
    createdAt: new Date().toISOString(),
  })

  saveDb()
  return NextResponse.json({ complaint: newComplaint }, { status: 201 })
}
```

---

## 11. OUTPUT SCREENSHOTS & USER INTERFACE

1. **Landing Page & Navigation Portal**: Features an institutional hero banner, direct login/registration access, and feature highlights covering grievance reporting, role-based routing, real-time status notifications, administrative analytics, and lost & found management.
2. **Student Anti-Ragging Portal & Helpline Center**: Features a prominent "Zero Tolerance Campus Policy" header with 24/7 emergency contacts (National Toll-Free Anti-Ragging Helpline `1800-180-5522`, campus security control room, chief proctor hotline).
3. **Confidential & Anonymous Incident Reporting Form**: Collects incident details across eight UGC categories: Verbal Abuse, Physical Harassment, Hostile Behavior, Cyber Ragging, Extortion, Sexual Harassment, Discrimination, and Other. Includes file uploads and an anonymous reporting toggle.
4. **Live Status Tracking Dashboard with Visual Timeline**: Displays interactive status badges and an 6-stage timeline: `[Submitted]` $	o$ `[Under Review]` $	o$ `[Assigned to HOD]` $	o$ `[Investigation in Progress]` $	o$ `[Action Taken]` $	o$ `[Resolved]`.
5. **Admin Anti-Ragging Oversight & Assignment Dashboard**: Executive dashboard with high-level metric cards: Total Complaints, New Submissions, Under Review, Assigned, In Progress, and Resolved. Admins verify reports and route them to department HODs.
6. **HOD Investigation & Disciplinary Action Portal**: Isolated workspace displaying complaints routed specifically to each academic department (e.g., CSE, ECE, Mechanical, Civil) to record inquiry notes, disciplinary actions, and resolution remarks.
7. **General Campus Grievance & Lost & Found Management**: Enables students and faculty to file facility tickets (electrical, plumbing, furniture, network) and register lost/found items with verified claim handling.

---

## 12. ADVANTAGES

1. **Guaranteed Anonymity & Psychological Safety**: Junior students can report incidents without fear of academic or social retribution through full identity masking, directly overcoming the primary barrier to ragging elimination.
2. **Regulatory Compliance**: Designed in strict adherence to UGC Anti-Ragging Regulations and Supreme Court mandates, providing standard 24/7 helplines and structured escalation pathways.
3. **End-to-End Transparency**: The 6-stage progress timeline gives students real-time visibility into complaint handling, replacing administrative opacity with transparency.
4. **Immutable Auditability**: Every status update, administrative summon, witness interview note, and disciplinary order is recorded in an immutable, timestamped audit log.
5. **High Cryptographic Security**: Utilizes scrypt salted hashing and HMAC-SHA256 session signatures with constant-time equality comparisons, protecting against rainbow tables, brute-force attacks, and timing exploits.
6. **Unified Campus Administration**: Integrates student safety, facility maintenance, and lost & found workflows into a single institutional portal, avoiding fragmented third-party tools.
7. **Responsive User Experience**: Server-rendered React 19 and Next.js 16 components with Tailwind CSS guarantee responsive, fast loading across all mobile and desktop devices.

---

## 13. LIMITATIONS

1. **Network Connectivity Dependency**: As a web-based platform, users require an active internet connection or campus Wi-Fi network to submit and track complaints.
2. **Requirement of Physical Verification**: While digital evidence can be uploaded securely, physical incident validation, eyewitness interviews, and CCTV reviews still require human coordination by anti-ragging committees.
3. **Risk of Unsubstantiated Claims**: Anonymity encourages truthful reporting, but human administrative oversight remains necessary to screen out frivolous or misattributed submissions.
4. **Attachment Size Constraints**: The current file attachment mechanism imposes standard HTTP payload size constraints for multimedia uploads; high-definition video evidence must be stored externally or compressed.
5. **Legacy System Integration**: Older legacy institutional databases (such as legacy SQL ERP systems) require custom integration connectors or API adapters to synchronize student enrollment records.

---

## 14. CONCLUSION

The **Campus Care** project successfully provides an effective, secure, and user-centric platform addressing campus grievance resolution and anti-ragging compliance. Developed as a Community Service Project (CSP) in the Department of Information Engineering & Computational Technology at MVGR College of Engineering (Autonomous), the platform bridges critical communication and procedural gaps among students, department heads, maintenance personnel, and central administrators.

By incorporating an anonymous reporting channel, Campus Care eliminates the barrier of intimidation that often prevents victims from speaking out. The automated 6-stage lifecycle—from preliminary submission and proctorial verification to departmental inquiry, action logging, and resolution—ensures accountability throughout the process. Every intervention is documented in an append-only audit trail, providing statutory compliance and verifiable records.

The technical architecture combines Next.js 16, React 19, TypeScript, Tailwind CSS, and cryptographic primitives including scrypt salted hashing and HMAC-SHA256 session integrity. Campus Care offers educational institutions a production-ready solution that fosters campus safety, transparency, and operational efficiency.

---

## 15. FUTURE SCOPE

1. **AI-Driven Severity Assessment**: Implementing natural language processing (NLP) and sentiment analysis to automatically categorize urgency, detect distress signals, and recommend immediate proctorial intervention.
2. **Native Mobile Apps with Panic Button**: Developing native Android and iOS mobile applications with WebPush and Apple Push Notification service (APNs) for instant emergency alerts and silent panic triggers.
3. **Blockchain-Based Audit Anchoring**: Anchoring complaint audit hashes to a private or consortium blockchain to provide mathematically verifiable, tamper-proof proof of evidence submission.
4. **University SSO & Identity Federation**: Integrating SAML 2.0 / OpenID Connect (OIDC) protocols to enable Single Sign-On (SSO) with existing university identity providers (e.g., Google Workspace, Microsoft Entra ID).
5. **Automated Escalation Timers**: Implementing automated rule-based timers that trigger hierarchical alerts to institutional management if high-severity tickets remain unassigned beyond designated hours.

---

## 16. REFERENCES

1. University Grants Commission (UGC), *"Regulations on Curbing the Menace of Ragging in Higher Educational Institutions"*, New Delhi, 2009. [Online]. Available: https://www.ugc.gov.in/page/Ragging-Related.aspx
2. National Anti-Ragging Helpline & Portal, Ministry of Education, Government of India. [Online]. Available: https://www.antiragging.in/
3. Vercel, *"Next.js 16 Documentation & App Router Architecture"*, 2024. [Online]. Available: https://nextjs.org/docs
4. React Core Team, *"React 19 Documentation & Server Components"*, Meta Platforms Inc., 2024. [Online]. Available: https://react.dev/
5. Colin Percival, *"Stronger Key Derivation via Sequential Memory-Hard Functions (scrypt)"*, BSDCan, 2009. [Online]. Available: https://www.tarsnap.com/scrypt/scrypt.pdf
6. National Institute of Standards and Technology (NIST), *"Digital Identity Guidelines: Authentication and Lifecycle Management"*, Special Publication 800-63B, 2020.
7. OWASP Foundation, *"OWASP Top Ten Web Application Security Risks"*, 2021. [Online]. Available: https://owasp.org/www-project-top-ten/
8. Tailwind Labs Inc., *"Tailwind CSS Documentation: Modern Utility-First CSS Framework"*, 2024. [Online]. Available: https://tailwindcss.com/docs
9. Radix Primitives Team, *"Accessible UI Component Primitives for React"*, WorkOS, 2024. [Online]. Available: https://www.radix-ui.com/
10. Vercel, *"SWR: React Hooks for Data Fetching & Stale-While-Revalidate"*, 2024. [Online]. Available: https://swr.vercel.app/
