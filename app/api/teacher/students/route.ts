import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const classCode = searchParams.get("classCode")

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )

    let query = supabase.from("user_profiles").select("*").eq("role", "student")
    if (classCode) query = query.eq("class_code", classCode)

    const { data: students, error } = await query

    if (error) throw error

    // Enrich with roadmap progress
    const enriched = await Promise.all(
      (students || []).map(async (s: any) => {
        const { data: roadmap } = await supabase
          .from("career_roadmaps")
          .select("progress_percent, predictive_score")
          .eq("user_id", s.user_id)
          .single()

        return {
          ...s,
          progress: roadmap?.progress_percent || 0,
          predictiveScore: roadmap?.predictive_score || 0,
        }
      })
    )

    return NextResponse.json({ success: true, students: enriched })
  } catch (error) {
    console.error("Teacher students error:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}
