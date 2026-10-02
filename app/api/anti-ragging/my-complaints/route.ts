import { NextResponse } from "next/server"
import { db } from "@/lib/store"
import { getCurrentUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const complaints = db.antiRaggingComplaints || []
  const myComplaints = complaints
    .filter(
      (c) =>
        c.studentEmail?.toLowerCase() === user.email.toLowerCase() ||
        (user.studentId && c.studentId === user.studentId)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json({ complaints: myComplaints })
}
