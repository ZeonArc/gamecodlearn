import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { jsonModel } from "@/lib/gemini"

/**
 * Smart Resume Builder API
 * Generates tailored resume bullet points based on the user's
 * completed DAG nodes, profile, and synthesized projects.
 */
export async function POST(req: Request) {
  try {
    const { userId, targetRole } = await req.json()

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

    // Fetch profile and roadmap
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    const { data: roadmap } = await supabase
      .from('career_roadmaps')
      .select('dag_data')
      .eq('user_id', userId)
      .single()

    const completedNodes = (roadmap?.dag_data as any[] || [])
      .filter((n: any) => n.status === 'completed')
    
    const completedSkills = completedNodes
      .map((n: any) => n.label || n.title)
      .join(", ")

    const allSkills = profile?.skills?.join(", ") || completedSkills
    const goal = targetRole || profile?.career_goal || "Software Engineer"

    const prompt = `You are an expert resume writer for tech roles.
    
Candidate Profile:
- Background: ${profile?.academic_background || "Computer Science Student"}
- Skills: ${allSkills}
- Completed Learning Milestones: ${completedSkills || "None yet"}
- Target Role: ${goal}

Generate a tailored resume content package. Return a JSON object:
{
  "summary": "A powerful 2-3 sentence professional summary tailored to the target role.",
  "skills": {
    "technical": ["skill1", "skill2", ...],
    "tools": ["tool1", "tool2", ...],
    "soft": ["skill1", "skill2"]
  },
  "projects": [
    {
      "title": "Project Name",
      "description": "1 sentence description",
      "bullets": ["Achievement-oriented bullet 1 using STAR method", "bullet 2"],
      "techUsed": ["React", "Node.js"]
    }
  ],
  "certificationSuggestions": ["Cert name 1", "Cert name 2"],
  "tips": ["Resume tip 1 specific to their target role", "tip 2"]
}`

    const result = await jsonModel.generateContent(prompt)
    const resumeData = JSON.parse(result.response.text())

    // Save resume snapshot
    await supabase
      .from('resumes')
      .upsert({
        user_id: userId,
        target_role: goal,
        resume_data: resumeData,
        generated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    return NextResponse.json({ success: true, resume: resumeData })

  } catch (error) {
    console.error("Resume API Error:", error)
    return NextResponse.json({ error: "Failed to generate resume" }, { status: 500 })
  }
}
