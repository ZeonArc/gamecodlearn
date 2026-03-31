import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { jsonModel } , parseAIJSON } from "@/lib/gemini"

/**
 * Predictive Success Score API
 * Calculates probability of landing a target role by comparing:
 * - User's completed skills vs. market demands
 * - DAG progress
 * - Skill freshness (decay factor)
 */
export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

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

    // Fetch everything
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    const { data: roadmap } = await supabase
      .from('career_roadmaps')
      .select('dag_data, progress_percent')
      .eq('user_id', userId)
      .single()

    const { data: userSkills } = await supabase
      .from('user_skills')
      .select('*')
      .eq('user_id', userId)

    const nodes = (roadmap?.dag_data as any[]) || []
    const completed = nodes.filter((n: any) => n.status === 'completed')
    const totalProgress = roadmap?.progress_percent || 0

    // Calculate skill freshness
    const now = Date.now()
    const DECAY_DAYS = 30
    let freshSkillCount = 0
    let totalSkillCount = userSkills?.length || 0

    userSkills?.forEach((skill: any) => {
      const lastVerified = new Date(skill.last_verified).getTime()
      const daysSince = (now - lastVerified) / (1000 * 60 * 60 * 24)
      if (daysSince < DECAY_DAYS) freshSkillCount++
    })

    const freshnessRatio = totalSkillCount > 0 ? freshSkillCount / totalSkillCount : 0

    // Ask AI for market-aligned scoring
    const prompt = `You are a career analytics AI. Analyze this candidate and predict their readiness for their target role.

Profile:
- Target Role: ${profile?.career_goal || "Software Engineer"}
- Background: ${profile?.academic_background || "Unknown"}
- Skills: ${profile?.skills?.join(", ") || "None listed"}
- Roadmap Progress: ${totalProgress}% complete (${completed.length}/${nodes.length} milestones)
- Skill Freshness: ${Math.round(freshnessRatio * 100)}% of skills are current (verified within 30 days)

Return a JSON object:
{
  "overallScore": number (0-100, realistic probability of landing the role),
  "dimensions": {
    "technicalReadiness": number (0-100),
    "marketAlignment": number (0-100),
    "experienceLevel": number (0-100),
    "portfolioStrength": number (0-100)
  },
  "strengths": ["strength 1", "strength 2"],
  "gaps": ["gap 1", "gap 2"],
  "nextBestAction": "One specific action they should take next to improve their score"
}`

    const result = await jsonModel.generateContent(prompt)
    const prediction = parseAIJSON(result.response.text())

    // Save the score
    await supabase
      .from('career_roadmaps')
      .update({ predictive_score: prediction.overallScore })
      .eq('user_id', userId)

    return NextResponse.json({ success: true, prediction })

  } catch (error) {
    console.error("Predict API Error:", error)
    return NextResponse.json({ error: "Failed to calculate prediction" }, { status: 500 })
  }
}
