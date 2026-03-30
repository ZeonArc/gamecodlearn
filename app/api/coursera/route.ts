import { NextResponse } from "next/server"
import { searchCourseraCourses } from "@/lib/coursera/client"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  
  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 })
  }

  try {
    const courses = await searchCourseraCourses(query, 3)
    return NextResponse.json({ success: true, courses })
  } catch (error) {
    console.error("Coursera Route Error:", error)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}
