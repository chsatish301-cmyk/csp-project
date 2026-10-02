# Campus Care — Campus Grievance, Resource & Anti-Ragging Management System

Campus Care is a modern, unified, full-stack campus operations platform built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**. It provides comprehensive incident tracking, maintenance scheduling, an admin-managed Lost & Found registry, and a dedicated, UGC-compliant **Anti-Ragging Module** with role-based access control (RBAC), end-to-end inquiry workflows, and immutable audit logs.

---

## 1. Project Overview

Campus Care streamlines communication between students, faculty, department heads, maintenance personnel, and campus administrators:
- **Student & Faculty Portal**: File general campus complaints (electrical, plumbing, civil, network), submit confidential Anti-Ragging reports, browse Lost & Found items, and claim found articles.
- **Admin Portal**: Campus-wide oversight, incident verification, department routing, user role management, system analytics, and announcement broadcasts.
- **Department HOD / Sub-Admin Portal**: Department-isolated case investigations, disciplinary action recording, counseling scheduling, and resolution management.
- **Maintenance Portal**: Assigned task tracking, job status updates, and lost item registration.
- **Live Notifications & Status Tracking**: Instant updates on complaints, status transitions, and announcements.

---

## 2. Requirements

- **Node.js**: `18.18.0` or higher (tested on Node.js 20, 22, and 24)
- **Package Manager**: `npm` (v9+) or `pnpm` (v9.15+)
- **Git**: Required for version control and CI/CD deployment
- **Operating System**: Windows, macOS, or Linux

---

## 3. Installation

Clone the repository and install dependencies:

```bash
# 1. Clone repository
git clone https://github.com/chsatish301-cmyk/csp-project.git
cd csp-project

# 2. Install dependencies
npm install
# or if using pnpm:
pnpm install
```

---

## 4. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

### Environment Configuration (`.env.local` / `.env.example`)

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `SESSION_SECRET` | Recommended | `Campus Care-default-secret-change-me` | 32+ character HMAC key used to securely sign session cookies. |
| `DB_PATH` | Optional | `.data/db.json` | Custom absolute or relative file path for database storage. Automatically set to `/tmp/campus_care_db.json` in serverless environments. |
| `NEXT_PUBLIC_APP_URL` | Optional | `http://localhost:3000` | Canonical public URL of the deployed application. |
| `PORT` | Optional | `3000` | Port for production test server. |

---

## 5. Database Setup & Architecture

Campus Care includes an embedded, high-performance file-based JSON database engine with zero external database dependencies:
- **Location**: Default is `.data/db.json` locally; automatically switches to writable system temporary storage (`os.tmpdir()` / `/tmp`) in serverless environments like Vercel or AWS Lambda.
- **Configurable**: Override the location at any time using the `DB_PATH` environment variable.
- **Automatic Seeding**: If the database file is not present, the store automatically initializes with default users, departments, sample resources, announcements, and demo complaints.
- **Thread & Serverless Safety**: Signed cryptographic session tokens encode verified user identities directly into HTTP-only cookies, ensuring seamless session persistence across serverless invocations.

---

## 6. Frontend & Backend Architecture

Campus Care uses Next.js App Router for unified frontend and backend routing:
- **Frontend (`/app`)**: Server Components for instant rendering, Client Components with SWR for reactive updates, Tailwind CSS v4 styling, and Lucide icons.
- **Backend API (`/app/api`)**: Next.js Route Handlers delivering JSON REST APIs with HTTP-only cookie authentication, CORS headers, and RBAC protection.
- **Custom 404 Handler (`app/not-found.tsx`)**: Friendly, responsive Not Found screen preventing raw error pages.

---

## 7. Development & Production Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server (Turbopack) on `http://localhost:3000` |
| `npm run build` | Compiles optimized production bundle and runs type validation |
| `npm run start` | Launches production Next.js server locally on port `3000` (or `PORT`) |
| `npx tsc --noEmit` | Runs full TypeScript compiler check across the entire project |

---

## 8. Automated Testing

An automated end-to-end integration and security test suite is located in `tests/test-flow.mjs`.

### Running Tests

1. Start the server (in one terminal):
   ```bash
   npm run build
   npx next start -p 3008
   ```

2. Run the test suite (in another terminal):
   ```bash
   # Linux/macOS
   TEST_URL="http://127.0.0.1:3008" node tests/test-flow.mjs

   # Windows PowerShell
   $env:TEST_URL="http://127.0.0.1:3008"; node tests/test-flow.mjs
   ```

### Tested Scenarios
- Student authentication and complaint filing (`AR-2026-XXXXXX`)
- Admin complaint verification and assignment to Department HOD
- HOD department inquiry recording and resolution
- Student investigation timeline and audit history retrieval
- RBAC boundary testing (unauthorized actions blocked with 403 Forbidden)

---

## 9. Deployment (Vercel)

The project is pre-configured for automated deployment on Vercel:

1. **Framework Preset**: Configured as `nextjs` via `vercel.json`.
2. **Root Directory**: Leave as `./` (default repository root).
3. **Build Command**: `next build` (or `npm run build`).
4. **Output Directory**: `.next` (default Next.js output).
5. **Environment Variables**: Add `SESSION_SECRET` in your Vercel Project Settings under Environment Variables.

Every push to branch `main` on GitHub triggers an automatic production deployment.

---

## 10. Troubleshooting & Fixing 404 Issues

If you encounter a `404 / Page Not Found` error in deployment:

1. **Ensure Vercel Root Directory is `./`**:
   - In Vercel Project Settings > General > **Root Directory**, ensure it is left blank or set to `./`. If it was mistakenly set to `csp-project`, Vercel cannot find the files since they are at the repository root.
2. **Next.js Framework Detection**:
   - `vercel.json` is included in the project with `"framework": "nextjs"`. This ensures Vercel routes dynamic serverless routes through Next.js rather than serving static files.
3. **Supported Route Aliases**:
   - Route redirects are defined in `next.config.mjs` so direct navigation or bookmarks to `/student`, `/student/dashboard`, `/student/complaints`, `/admin/dashboard`, or `/hod/dashboard` automatically redirect to the correct portal pages without returning 404.
4. **Direct URL Refreshing**:
   - All layouts and pages use `export const dynamic = "force-dynamic"`, ensuring serverless functions dynamically handle refreshed browser requests with active cookies.

---

## 11. Demo Accounts & Credentials

Default demo password for all accounts: **`vivek@2006`**

| Portal | Email | Role | Department | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Admin Portal** | `admin@campus.edu` | `admin` | Administration | Campus-wide control, complaint verification, HOD assignment |
| **HOD Portal** | `hod.cse@campus.edu` | `hod` | CSE | Dr. Alan Turing — CSE Department Head |
| **HOD Portal** | `hod.ece@campus.edu` | `hod` | ECE | Dr. Claude Shannon — ECE Department Head |
| **HOD Portal** | `hod.mech@campus.edu` | `hod` | Mechanical | Dr. Nikola Tesla — Mech Department Head |
| **Student Portal**| `student@campus.edu` | `student` | CSE | Sam Student — Submit grievances & anti-ragging complaints |
| **Faculty Portal**| `faculty@campus.edu` | `faculty` | CSE | Prof. Grace Hopper — Faculty member |
| **Maintenance** | `maintenance@campus.edu` | `maintenance`| Facilities | Campus maintenance engineer |

---

## 12. License & Author

Developed for the **Community Service Project (CSP)** — Campus Care System.
