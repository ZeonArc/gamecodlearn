import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { jsonModel } , parseAIJSON } from "@/lib/gemini"
import { searchCourseraCourses } from "@/lib/coursera/client"

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 })

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )

    const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", userId).single()
    const { data: roadmap } = await supabase.from("career_roadmaps").select("dag_data, progress_percent").eq("user_id", userId).single()

    const completedSkills = (roadmap?.dag_data as any[] || [])
      .filter((n: any) => n.status === "completed")
      .map((n: any) => n.label || n.title).join(", ")

    const allSkills = profile?.skills?.join(", ") || "programming"
    const goal = profile?.career_goal || "Software Engineer"
    const progress = roadmap?.progress_percent || 0

    // Ask AI for optimal course searches
    const prompt = `You are a Learning Path Advisor. Based on this student's profile, recommend specific Coursera course searches.

Student Profile:
- Skills: ${allSkills}
- Career Goal: ${goal}
- Roadmap Progress: ${progress}%
- Completed Milestones: ${completedSkills || "None yet"}

Generate a personalized learning plan. Return JSON:
{
  "plan": [
    {
      "priority": 1,
      "category": "Category name (e.g. 'Core Skill Gap')",
      "searchQuery": "2-4 word Coursera search query",
      "reason": "Why this course matters for their goal",
      "estimatedImpact": "high|medium|low",
      "timeCommitment": "X hours/week for Y weeks"
    }
  ],
  "overallAdvice": "1-2 sentence personalized learning strategy"
}
Generate exactly 4 course recommendations.`

    const aiResult = await jsonModel.generateContent(prompt)
    const aiPlan = parseAIJSON(aiResult.response.text())

    // Fetch actual Coursera courses for each recommendation
    const enrichedPlan = await Promise.all(
      aiPlan.plan.map(async (item: any) => {
        const courses = await searchCourseraCourses(item.searchQuery, 2)
        return { ...item, courses }
      })
    )

    return NextResponse.json({
      success: true,
      plan: enrichedPlan,
      overallAdvice: aiPlan.overallAdvice,
    })
  } catch (error) {
    console.error("Coursera bot error:", error)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
