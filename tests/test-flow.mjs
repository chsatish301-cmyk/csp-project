// Automated End-to-End Workflow & Security Test
const BASE_URL = process.env.TEST_URL || "http://127.0.0.1:3005"

async function run() {
  console.log(`Starting tests against ${BASE_URL}...`)

  let studentCookie = ""
  let adminCookie = ""
  let hodCookie = ""

  // Helper fetch with cookies
  async function api(path, options = {}, cookie = "") {
    const headers = {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...options.headers,
    }
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    })
    const setCookie = res.headers.get("set-cookie")
    const data = await res.json().catch(() => ({}))
    return { status: res.status, data, setCookie }
  }

  // 1. Student Login
  console.log("\n[1] Testing Student Login...")
  const stuLogin = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: "student@campus.edu", password: "vivek@2006" }),
  })
  if (stuLogin.status !== 200 || !stuLogin.setCookie) {
    throw new Error(`Student login failed: ${JSON.stringify(stuLogin.data)}`)
  }
  studentCookie = stuLogin.setCookie.split(";")[0]
  console.log("✓ Student logged in successfully. User:", stuLogin.data.user.email)

  // 2. Student Submits Complaint
  console.log("\n[2] Testing Student Submitting Anti-Ragging Complaint...")
  const subRes = await api(
    "/api/anti-ragging/complaints",
    {
      method: "POST",
      body: JSON.stringify({
        category: "verbal_abuse",
        incidentDate: "2026-10-02",
        incidentTime: "14:30",
        location: "Hostel Block C Corridors",
        description: "Senior students demanded junior students stand outside rooms for 2 hours.",
        peopleInvolved: "3 students from 3rd year",
        anonymous: false,
        evidence: "Roommate witnessed this incident",
        department: "CSE",
        year: "1st Year",
        section: "A",
      }),
    },
    studentCookie
  )
  if (subRes.status !== 201 || !subRes.data.complaint) {
    throw new Error(`Student complaint submission failed: ${JSON.stringify(subRes.data)}`)
  }
  const complaint = subRes.data.complaint
  console.log(`✓ Complaint created with ID: ${complaint.id}, Code: ${complaint.complaintId}, Status: ${complaint.status}`)

  // 3. Admin Login
  console.log("\n[3] Testing Admin Login...")
  const admLogin = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: "admin@campus.edu", password: "vivek@2006" }),
  })
  if (admLogin.status !== 200 || !admLogin.setCookie) {
    throw new Error(`Admin login failed: ${JSON.stringify(admLogin.data)}`)
  }
  adminCookie = admLogin.setCookie.split(";")[0]
  console.log("✓ Admin logged in successfully.")

  // 4. Admin Checks All Complaints
  console.log("\n[4] Admin fetching all complaints...")
  const admList = await api("/api/anti-ragging/complaints", { method: "GET" }, adminCookie)
  if (admList.status !== 200 || !admList.data.complaints) {
    throw new Error(`Admin fetching complaints failed: ${JSON.stringify(admList.data)}`)
  }
  const found = admList.data.complaints.find((c) => c.id === complaint.id)
  if (!found) {
    throw new Error("Newly created complaint not found in admin list!")
  }
  console.log(`✓ Admin verified complaint ${found.complaintId} in complaints registry.`)

  // 5. Admin Verifies Complaint
  console.log("\n[5] Admin verifying complaint...")
  const verRes = await api(
    `/api/anti-ragging/complaints/${complaint.id}/verify`,
    {
      method: "PUT",
      body: JSON.stringify({ remarks: "Preliminary facts verified with hostel warden." }),
    },
    adminCookie
  )
  if (verRes.status !== 200 || verRes.data.complaint.status !== "Under Review") {
    throw new Error(`Verification failed: ${JSON.stringify(verRes.data)}`)
  }
  console.log(`✓ Complaint verified. New Status: ${verRes.data.complaint.status}`)

  // 6. Admin Assigns Complaint to HOD CSE
  console.log("\n[6] Admin assigning complaint to HOD CSE...")
  const assignRes = await api(
    `/api/anti-ragging/complaints/${complaint.id}/assign`,
    {
      method: "PUT",
      body: JSON.stringify({
        hodId: "u_hod_cse",
        remarks: "Please conduct department anti-ragging squad inquiry.",
      }),
    },
    adminCookie
  )
  if (assignRes.status !== 200 || assignRes.data.complaint.status !== "Assigned to HOD") {
    throw new Error(`Assignment failed: ${JSON.stringify(assignRes.data)}`)
  }
  console.log(`✓ Complaint assigned to ${assignRes.data.complaint.assignedHodName}. Status: ${assignRes.data.complaint.status}`)

  // 7. HOD Login
  console.log("\n[7] Testing HOD Login...")
  const hodLogin = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: "hod.cse@campus.edu", password: "vivek@2006" }),
  })
  if (hodLogin.status !== 200 || !hodLogin.setCookie) {
    throw new Error(`HOD login failed: ${JSON.stringify(hodLogin.data)}`)
  }
  hodCookie = hodLogin.setCookie.split(";")[0]
  console.log("✓ HOD logged in successfully:", hodLogin.data.user.name)

  // 8. HOD Views Assigned Complaints
  console.log("\n[8] HOD fetching assigned complaints...")
  const hodList = await api("/api/anti-ragging/complaints", { method: "GET" }, hodCookie)
  if (hodList.status !== 200 || !hodList.data.complaints) {
    throw new Error(`HOD fetching complaints failed: ${JSON.stringify(hodList.data)}`)
  }
  const hodComplaint = hodList.data.complaints.find((c) => c.id === complaint.id)
  if (!hodComplaint) {
    throw new Error("Complaint not found in HOD assigned list!")
  }
  console.log(`✓ HOD successfully found assigned complaint ${hodComplaint.complaintId}.`)

  // 9. HOD Updates Investigation & Records Action
  console.log("\n[9] HOD recording inquiry and disciplinary action...")
  const actionRes = await api(
    `/api/anti-ragging/complaints/${complaint.id}/actions`,
    {
      method: "POST",
      body: JSON.stringify({
        action: "Disciplinary Warning & Counseling Issued",
        status: "Action Taken",
        investigationNotes: "Inquiry conducted with accused students. They confessed and submitted written apology.",
        actionTaken: "Issued formal warning letters to parents and mandated 2 weeks campus community service.",
      }),
    },
    hodCookie
  )
  if (actionRes.status !== 200 || actionRes.data.complaint.status !== "Action Taken") {
    throw new Error(`HOD recording action failed: ${JSON.stringify(actionRes.data)}`)
  }
  console.log(`✓ Action recorded. Status: ${actionRes.data.complaint.status}`)

  // 10. HOD Resolves Complaint
  console.log("\n[10] HOD marking complaint as Resolved...")
  const resolveRes = await api(
    `/api/anti-ragging/complaints/${complaint.id}/status`,
    {
      method: "PUT",
      body: JSON.stringify({
        status: "Resolved",
        remarks: "Apologies submitted, counseling scheduled, no further complaints from junior students.",
      }),
    },
    hodCookie
  )
  if (resolveRes.status !== 200 || resolveRes.data.complaint.status !== "Resolved") {
    throw new Error(`Resolving complaint failed: ${JSON.stringify(resolveRes.data)}`)
  }
  console.log(`✓ Complaint status updated to: ${resolveRes.data.complaint.status}`)

  // 11. Student Checks Status & History
  console.log("\n[11] Student fetching updated status and history timeline...")
  const stuCheck = await api(`/api/anti-ragging/complaints/${complaint.id}`, { method: "GET" }, studentCookie)
  if (stuCheck.status !== 200 || stuCheck.data.complaint.status !== "Resolved") {
    throw new Error(`Student checking resolved status failed: ${JSON.stringify(stuCheck.data)}`)
  }
  console.log(`✓ Student received resolved status. History entries count: ${stuCheck.data.history.length}`)
  stuCheck.data.history.forEach((h, idx) => {
    console.log(`   ${idx + 1}. [${h.performedByRole.toUpperCase()}] ${h.action}: ${h.remarks}`)
  })

  // 12. Security & RBAC Checks
  console.log("\n[12] Testing Security & RBAC boundaries...")

  // A. Student cannot verify
  const stuVerify = await api(
    `/api/anti-ragging/complaints/${complaint.id}/verify`,
    { method: "PUT", body: JSON.stringify({}) },
    studentCookie
  )
  if (stuVerify.status !== 403) {
    throw new Error(`Security breach: Student should be blocked from verifying complaint! Status: ${stuVerify.status}`)
  }
  console.log("✓ Student blocked from admin verify endpoint (403).")

  // B. Student cannot change status
  const stuStatus = await api(
    `/api/anti-ragging/complaints/${complaint.id}/status`,
    { method: "PUT", body: JSON.stringify({ status: "Resolved" }) },
    studentCookie
  )
  if (stuStatus.status !== 403) {
    throw new Error(`Security breach: Student should be blocked from changing status! Status: ${stuStatus.status}`)
  }
  console.log("✓ Student blocked from changing complaint status directly (403).")

  // C. HOD Mech cannot access HOD CSE assigned complaint
  const hodMechLogin = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: "hod.mech@campus.edu", password: "vivek@2006" }),
  })
  const hodMechCookie = hodMechLogin.setCookie.split(";")[0]
  const hodMechAccess = await api(
    `/api/anti-ragging/complaints/${complaint.id}`,
    { method: "GET" },
    hodMechCookie
  )
  if (hodMechAccess.status !== 403) {
    throw new Error(`Security breach: Unrelated HOD was able to access complaint! Status: ${hodMechAccess.status}`)
  }
  console.log("✓ Unrelated HOD blocked from accessing complaint outside their department/assignment (403).")

  console.log("\n============================================")
  console.log("🎉 ALL END-TO-END AND SECURITY TESTS PASSED!")
  console.log("============================================\n")
}

run().catch((err) => {
  console.error("Test failed:", err)
  process.exit(1)
})
