import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { jsonModel } from "@/lib/gemini"

/**
 * Project Synthesis API
 * Generates a custom project prompt that combines a set of completed skills
 * into a cohesive, portfolio-worthy project for the user.
 */
export async function POST(req: Request) {
  try {
    const { userId, skillCluster } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll() { /* read-only */ }
        }
      }
    )

    // Fetch completed skills either from input or from the roadmap
    let skills = skillCluster
    if (!skills) {
      const { data: roadmap } = await supabase
        .from('career_roadmaps')
        .select('dag_data')
        .eq('user_id', userId)
        .single()

      skills = (roadmap?.dag_data as any[] || [])
        .filter((n: any) => n.status === 'completed')
        .map((n: any) => n.label || n.title)
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('career_goal, academic_background')
      .eq('user_id', userId)
      .single()

    const prompt = `You are a Senior Project Architect and Portfolio Coach.

A student (${profile?.academic_background || "CS Student"}) targeting "${profile?.career_goal || "Software Engineer"}" has completed these skills:
${Array.isArray(skills) ? skills.join(", ") : skills}

Design a UNIQUE, portfolio-worthy project that creatively combines ALL of these skills.
The project should be impressive enough for a resume and interview discussion.

Return a JSON object:
{
  "title": "Catchy Project Name",
  "tagline": "One-line elevator pitch",
  "description": "3-4 sentence detailed description of what the project does and why it's interesting",
  "techStack": ["Tech 1", "Tech 2", "Tech 3"],
  "features": [
    { "name": "Feature Name", "description": "What it does", "skillUsed": "Which learned skill this applies" }
  ],
  "milestones": [
    { "phase": "Phase 1", "task": "What to build first", "estimatedHours": 4 },
    { "phase": "Phase 2", "task": "Next steps", "estimatedHours": 6 }
  ],
  "difficulty": "beginner|intermediate|advanced",
  "totalEstimatedHours": 20,
  "interviewTalkingPoints": ["Point 1 about what you'd discuss in an interview about this project"]
}`

    const result = await jsonModel.generateContent(prompt)
    const project = JSON.parse(result.response.text())

    return NextResponse.json({ success: true, project })

  } catch (error) {
    console.error("Project Synthesis Error:", error)
    return NextResponse.json({ error: "Failed to synthesize project" }, { status: 500 })
  }
}
